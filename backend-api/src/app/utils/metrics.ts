import { logger } from './logger';

export interface MetricData {
  name: string;
  value: number;
  unit: string;
  tags?: Record<string, string>;
  timestamp?: number;
}

export interface PerformanceMetrics {
  requestCount: number;
  responseTime: number[];
  errorCount: number;
  activeConnections: number;
  memoryUsage: NodeJS.MemoryUsage;
  cpuUsage: NodeJS.CpuUsage;
}

class MetricsCollector {
  private metrics: Map<string, MetricData[]> = new Map();
  private counters: Map<string, number> = new Map();
  private histograms: Map<string, number[]> = new Map();
  private startTime: number = Date.now();
  
  constructor() {
    // Start periodic metrics collection
    this.startPeriodicCollection();
  }

  // Counter metrics
  increment(name: string, value: number = 1, tags?: Record<string, string>) {
    const key = this.getMetricKey(name, tags);
    const current = this.counters.get(key) || 0;
    this.counters.set(key, current + value);
    
    this.recordMetric({
      name,
      value: current + value,
      unit: 'count',
      tags,
      timestamp: Date.now(),
    });
  }

  // Gauge metrics (current value)
  gauge(name: string, value: number, unit: string = 'count', tags?: Record<string, string>) {
    this.recordMetric({
      name,
      value,
      unit,
      tags,
      timestamp: Date.now(),
    });
  }

  // Histogram for response times, etc.
  histogram(name: string, value: number, tags?: Record<string, string>) {
    const key = this.getMetricKey(name, tags);
    const values = this.histograms.get(key) || [];
    values.push(value);
    this.histograms.set(key, values);

    // Keep only last 1000 values to prevent memory leak
    if (values.length > 1000) {
      values.splice(0, values.length - 1000);
    }

    this.recordMetric({
      name,
      value,
      unit: 'ms',
      tags,
      timestamp: Date.now(),
    });
  }

  // Timer utility
  timer(name: string, tags?: Record<string, string>) {
    const startTime = Date.now();
    
    return {
      end: () => {
        const duration = Date.now() - startTime;
        this.histogram(name, duration, tags);
        return duration;
      }
    };
  }

  // Get histogram statistics
  getHistogramStats(name: string, tags?: Record<string, string>) {
    const key = this.getMetricKey(name, tags);
    const values = this.histograms.get(key) || [];
    
    if (values.length === 0) {
      return null;
    }

    const sorted = [...values].sort((a, b) => a - b);
    const sum = values.reduce((a, b) => a + b, 0);
    
    return {
      count: values.length,
      min: sorted[0],
      max: sorted[sorted.length - 1],
      mean: sum / values.length,
      p50: sorted[Math.floor(sorted.length * 0.5)],
      p90: sorted[Math.floor(sorted.length * 0.9)],
      p95: sorted[Math.floor(sorted.length * 0.95)],
      p99: sorted[Math.floor(sorted.length * 0.99)],
    };
  }

  // Record HTTP request metrics
  recordHttpRequest(method: string, path: string, statusCode: number, duration: number) {
    const tags = { method, path, status: statusCode.toString() };
    
    this.increment('http_requests_total', 1, tags);
    this.histogram('http_request_duration', duration, tags);
    
    if (statusCode >= 400) {
      this.increment('http_errors_total', 1, tags);
    }
  }

  // Record database operation metrics
  recordDbOperation(operation: string, collection: string, duration: number, success: boolean) {
    const tags = { operation, collection, success: success.toString() };
    
    this.increment('db_operations_total', 1, tags);
    this.histogram('db_operation_duration', duration, tags);
    
    if (!success) {
      this.increment('db_errors_total', 1, tags);
    }
  }

  // Record PDF generation metrics
  recordPdfGeneration(duration: number, success: boolean, size?: number) {
    const tags = { success: success.toString() };
    
    this.increment('pdf_generations_total', 1, tags);
    this.histogram('pdf_generation_duration', duration, tags);
    
    if (size) {
      this.histogram('pdf_size_bytes', size, tags);
    }
    
    if (!success) {
      this.increment('pdf_errors_total', 1, tags);
    }
  }

  // Get current metrics summary
  getMetricsSummary(): any {
    const uptime = Date.now() - this.startTime;
    const memoryUsage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();
    
    return {
      uptime,
      memory: {
        rss: memoryUsage.rss,
        heapTotal: memoryUsage.heapTotal,
        heapUsed: memoryUsage.heapUsed,
        external: memoryUsage.external,
      },
      cpu: {
        user: cpuUsage.user,
        system: cpuUsage.system,
      },
      counters: Object.fromEntries(this.counters),
      histograms: Array.from(this.histograms.keys()).reduce((acc, key) => {
        const stats = this.getHistogramStats(key.split('|')[0], this.parseTagsFromKey(key));
        if (stats) {
          acc[key] = stats;
        }
        return acc;
      }, {} as any),
    };
  }

  private recordMetric(metric: MetricData) {
    const key = metric.name;
    const metrics = this.metrics.get(key) || [];
    metrics.push(metric);
    
    // Keep only last 100 metrics per key to prevent memory leak
    if (metrics.length > 100) {
      metrics.splice(0, metrics.length - 100);
    }
    
    this.metrics.set(key, metrics);
  }

  private getMetricKey(name: string, tags?: Record<string, string>): string {
    if (!tags) return name;
    const tagString = Object.entries(tags)
      .map(([k, v]) => `${k}:${v}`)
      .join(',');
    return `${name}|${tagString}`;
  }

  private parseTagsFromKey(key: string): Record<string, string> | undefined {
    const parts = key.split('|');
    if (parts.length < 2) return undefined;
    
    const tags: Record<string, string> = {};
    parts[1].split(',').forEach(tag => {
      const [k, v] = tag.split(':');
      if (k && v) tags[k] = v;
    });
    
    return tags;
  }

  private startPeriodicCollection() {
    setInterval(() => {
      this.collectSystemMetrics();
    }, 30000); // Every 30 seconds
  }

  private collectSystemMetrics() {
    const memoryUsage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();
    
    this.gauge('memory_rss_bytes', memoryUsage.rss, 'bytes');
    this.gauge('memory_heap_used_bytes', memoryUsage.heapUsed, 'bytes');
    this.gauge('memory_heap_total_bytes', memoryUsage.heapTotal, 'bytes');
    this.gauge('cpu_user_microseconds', cpuUsage.user, 'microseconds');
    this.gauge('cpu_system_microseconds', cpuUsage.system, 'microseconds');
    
    logger.debug('System metrics collected', {
      component: 'metrics',
      memory: memoryUsage,
      cpu: cpuUsage,
    });
  }
}

// Singleton instance
export const metrics = new MetricsCollector();

// Helper decorator for timing function execution
export function timed(metricName: string, tags?: Record<string, string>) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const timer = metrics.timer(metricName, tags);
      
      try {
        const result = await method.apply(this, args);
        timer.end();
        return result;
      } catch (error) {
        timer.end();
        metrics.increment(`${metricName}_errors`, 1, tags);
        throw error;
      }
    };

    return descriptor;
  };
}