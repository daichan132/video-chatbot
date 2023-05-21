import { useMutateAuth } from '@/hooks/useMutateAuth';
import {
  Button,
  Container,
  Text,
  Paper,
  PasswordInput,
  TextInput,
  Title,
  Anchor,
} from '@mantine/core';
import { FormEvent, useState } from 'react';

export const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { email, setEmail, password, setPassword, loginMutation, registerMutation } =
    useMutateAuth();
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLogin) {
      loginMutation.mutate();
    } else {
      registerMutation.mutate();
    }
  };
  return (
    <Container size={420} my={40}>
      <Title
        align="center"
        sx={(theme) => ({ fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 900 })}
      >
        Welcome back!
      </Title>
      <Text color="dimmed" size="sm" align="center" mt={5}>
        {!isLogin ? 'Do you already have an account? ' : 'Do not have an account yet? '}
        <Anchor size="sm" component="button" onClick={() => setIsLogin(!isLogin)}>
          {!isLogin ? 'Login' : 'Sign up'}
        </Anchor>
      </Text>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={handleSubmit}>
          <TextInput
            label="Email"
            placeholder="Your email"
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            required
            mt="md"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <Button fullWidth mt="xl" type="submit">
            {isLogin ? 'Login' : 'Sign up'}
          </Button>
        </form>
      </Paper>
    </Container>
  );
};
