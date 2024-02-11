
'use client'
import ExpenseForm from './ExpenseForm';
import { useTransactionContext } from '../TransactionProvider';
import { Container } from '@mui/material';
import useAddExpense from '@/hooks/useAddExpense';


export default function Page() {
  const { fetchData, state } = useTransactionContext()
  const handleSuccess = () => {
    fetchData(state.lastQuery)
  }

  const { initialValues, submit } = useAddExpense({ successCB: handleSuccess })

  return (
    <Container>
      <ExpenseForm initialValues={initialValues} submit={submit} />
    </Container>
  )
}
