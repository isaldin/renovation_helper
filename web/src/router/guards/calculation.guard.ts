import { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import { RouteNames } from '@app/router/routeNames';
import { useMeStore } from '@app/stores/me';

// Guard for calculation routes that redirects to report-already-exists
// if user already has a reportId
export const calculationGuard = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const meStore = useMeStore();
  const user = meStore.meUser;

  // If user has reportId, redirect to report already exists page
  if (user?.reportId) {
    next({ name: RouteNames.reportAlreadyExists });
    return;
  }

  // Otherwise allow access
  next();
};
