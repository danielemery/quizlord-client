import { gql } from '@apollo/client';

export const PENDING_USERS = gql`
  query GetPendingUsers {
    pendingUsers {
      id
      email
      name
    }
  }
`;

export const REJECTED_USERS = gql`
  query GetRejectedUsers {
    rejectedUsers {
      id
      email
      name
      rejectedAt
      rejectedByUser {
        email
        name
      }
    }
  }
`;

export const APPROVE_USER = gql`
  mutation ApproveUser($userId: String!, $roles: [UserRole!]!) {
    approveUser(userId: $userId, roles: $roles) {
      success
    }
  }
`;

export const REJECT_USER = gql`
  mutation RejectUser($userId: String!) {
    rejectUser(userId: $userId) {
      success
    }
  }
`;
