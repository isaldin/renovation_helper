import puppeteer, { Browser } from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';
import * as Handlebars from 'handlebars';
import { logger } from '../utils/logger';
import { PdfJobData, PdfOptions, DEFAULT_PDF_OPTIONS } from '@renovation-helper/pdf-worker-types';

export type ReportData = PdfJobData['reportData'];

export class PdfService {
  private browser: Browser | null = null;
  private template: Handlebars.TemplateDelegate | null = null;

  async init(): Promise<void> {
    // Initialize browser
    await this.initBrowser();

    // Load and compile HTML template
    // Try multiple possible paths for the template
    const possiblePaths = [
      path.resolve(process.cwd(), 'pdf-worker/templates/renovation-report.hbs'),
      path.resolve(process.cwd(), 'templates/renovation-report.hbs'),
      path.join(__dirname, '../../templates/renovation-report.hbs'),
      path.join(__dirname, '../templates/renovation-report.hbs'),
    ];

    let templatePath = '';
    for (const possiblePath of possiblePaths) {
      if (fs.existsSync(possiblePath)) {
        templatePath = possiblePath;
        break;
      }
    }

    if (!templatePath) {
      throw new Error(`Template not found. Searched paths: ${possiblePaths.join(', ')}`);
    }
    try {
      const templateContent = fs.readFileSync(templatePath, 'utf-8');
      this.template = Handlebars.compile(templateContent);
      logger.info('Template loaded successfully', { templatePath });
    } catch (error) {
      logger.error('Failed to load template', {
        templatePath,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }

    logger.info('PDF Service initialized successfully');
  }

  async generatePdf(reportData: ReportData, options: PdfOptions = {}): Promise<Uint8Array> {
    if (!this.template) {
      throw new Error('PDF Service not initialized');
    }

    // Ensure browser is connected
    await this.ensureBrowserConnected();
    
    if (!this.browser) {
      throw new Error('Failed to initialize browser');
    }

    let page;
    try {
      page = await this.browser.newPage();
    } catch (error) {
      logger.warn('Failed to create new page, reinitializing browser', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      
      // Reinitialize browser and try again
      await this.initBrowser();
      if (!this.browser) {
        throw new Error('Failed to reinitialize browser');
      }
      page = await this.browser.newPage();
    }

    try {
      // Generate HTML content
      const html = this.template(reportData);

      // Set page content
      await page.setContent(html, {
        waitUntil: 'networkidle0',
        timeout: 30000,
      });

      // Generate PDF
      const pdfBuffer = await page.pdf({
        format: options.format || DEFAULT_PDF_OPTIONS.format,
        printBackground: true,
        preferCSSPageSize: true,
        margin: options.margin || DEFAULT_PDF_OPTIONS.margin,
      });

      logger.info('PDF generated successfully', {
        size: pdfBuffer.length,
        format: options.format || 'A4',
      });

      return pdfBuffer;
    } catch (error) {
      logger.error('PDF generation failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    } finally {
      if (page) {
        try {
          await page.close();
        } catch (error) {
          logger.warn('Failed to close page', {
            error: error instanceof Error ? error.message : 'Unknown error',
          });
        }
      }
    }
  }

  private async ensureBrowserConnected(): Promise<void> {
    if (!this.browser || !this.browser.connected) {
      logger.info('Browser not connected, initializing...');
      await this.initBrowser();
    }
  }

  private async initBrowser(): Promise<void> {
    // Close existing browser if any
    if (this.browser) {
      try {
        await this.browser.close();
      } catch (error) {
        logger.warn('Failed to close existing browser', {
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
      this.browser = null;
    }

    // Launch new browser
    this.browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-gpu',
      ],
    });

    logger.info('Browser initialized successfully');
  }

  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      logger.info('PDF Service closed');
    }
  }
}
