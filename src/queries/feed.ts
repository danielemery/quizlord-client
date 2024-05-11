import { gql } from '@apollo/client';

export const ACTIVITY_FEED = gql`
  query GetActivityFeed {
    activityFeed {
      date
      text
      users {
        name
        email
      }
    }
  }
`;
