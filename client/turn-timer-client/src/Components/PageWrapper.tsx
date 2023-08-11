import { Stack, createStyles } from '@mantine/core'
import '../App.css'

type Props = {
  children: string | JSX.Element | JSX.Element[]
}

const useStyles = createStyles(() => ({
  header: {
    marginTop: 50
  }
}))

export function PageWrapper({ children }: Props) {
  const { classes } = useStyles();

  return <Stack spacing={'xs'} className={classes.header}>
    {children}
  </ Stack>
}