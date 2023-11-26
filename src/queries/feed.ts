import { gql } from '@apollo/client';

export const ACTIVITY_FEED = gql`
  query GetActivityFeed {
    activityFeed {
      date
      action {
        link
        name
      }
      text
    }
  }
`;
