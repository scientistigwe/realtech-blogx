import { createSelector } from "reselect";

// Base selector to get the notifications slice of state
const selectNotificationsState = (state) => state.notifications;

// Selector to get all notifications
export const selectAllNotifications = createSelector(
  [selectNotificationsState],
  (notificationsState) => notificationsState.notifications
);

// Selector to get loading state
export const selectLoading = createSelector(
  [selectNotificationsState],
  (notificationsState) => notificationsState.loading
);

// Selector to get error state
export const selectError = createSelector(
  [selectNotificationsState],
  (notificationsState) => notificationsState.error
);
