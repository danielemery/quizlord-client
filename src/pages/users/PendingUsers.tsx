import { useMutation } from '@apollo/client';

import Button from '../../components/Button';
import Loader from '../../components/Loader';
import { Table } from '../../components/Table';
import { formatDateTime, userIdentifier } from '../../helpers';
import { usePendingUsers } from '../../hooks/usePendingUsers.hook';
import { useRejectedUsers } from '../../hooks/useRejectedUsers.hook';
import { APPROVE_USER, REJECT_USER } from '../../queries/user';

export default function PendingUsers() {
  const { loading: pendingLoading, data: pendingData, refetch: refetchPending } = usePendingUsers();
  const { loading: rejectedLoading, data: rejectedData, refetch: refetchRejected } = useRejectedUsers();

  const [approveUser] = useMutation(APPROVE_USER);
  const [rejectUser] = useMutation(REJECT_USER);

  async function handleApprove(userId: string, refetch: () => void) {
    await approveUser({ variables: { userId, roles: ['USER'] } });
    refetch();
  }

  async function handleReject(userId: string) {
    await rejectUser({ variables: { userId } });
    refetchPending();
    refetchRejected();
  }

  if (pendingLoading || !pendingData) {
    return <Loader message='Loading pending users...' />;
  }

  const pendingUsers = pendingData.pendingUsers;
  const rejectedUsers = rejectedData?.rejectedUsers ?? [];

  return (
    <div className='p-4 lg:p-0'>
      <h2 className='text-xl font-semibold mb-4'>Pending Users</h2>
      <Table>
        <Table.Head>
          <Table.Row isHeader>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Email</Table.HeaderCell>
            <Table.HeaderCell>Actions</Table.HeaderCell>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {pendingUsers.map((user) => (
            <Table.Row key={user.id}>
              <Table.Cell>{userIdentifier(user)}</Table.Cell>
              <Table.Cell>{user.email}</Table.Cell>
              <Table.Cell>
                <div className='flex gap-2'>
                  <Button onClick={() => handleApprove(user.id, refetchPending)}>Approve</Button>
                  <Button danger onClick={() => handleReject(user.id)}>
                    Reject
                  </Button>
                </div>
              </Table.Cell>
            </Table.Row>
          ))}
          {pendingUsers.length === 0 && (
            <Table.Row>
              <Table.Cell colSpan={3}>
                <span className='text-gray-500'>No pending users.</span>
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>

      <h2 className='text-xl font-semibold mb-4 mt-8'>Rejected Users</h2>
      {rejectedLoading ? (
        <Loader message='Loading rejected users...' />
      ) : (
        <Table>
          <Table.Head>
            <Table.Row isHeader>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Email</Table.HeaderCell>
              <Table.HeaderCell>Rejected</Table.HeaderCell>
              <Table.HeaderCell>Actions</Table.HeaderCell>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {rejectedUsers.map((user) => (
              <Table.Row key={user.id}>
                <Table.Cell>{userIdentifier(user)}</Table.Cell>
                <Table.Cell>{user.email}</Table.Cell>
                <Table.Cell>
                  <span className='text-gray-500 text-xs'>
                    {formatDateTime(user.rejectedAt)} by {userIdentifier(user.rejectedByUser)}
                  </span>
                </Table.Cell>
                <Table.Cell>
                  <Button onClick={() => handleApprove(user.id, refetchRejected)}>Approve</Button>
                </Table.Cell>
              </Table.Row>
            ))}
            {rejectedUsers.length === 0 && (
              <Table.Row>
                <Table.Cell colSpan={4}>
                  <span className='text-gray-500'>No rejected users.</span>
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      )}
    </div>
  );
}
