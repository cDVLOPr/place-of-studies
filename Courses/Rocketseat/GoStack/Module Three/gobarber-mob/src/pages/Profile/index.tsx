import React, { useRef, useCallback } from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Alert,
} from 'react-native';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import { useNavigation } from '@react-navigation/native';
import * as Yup from 'yup';
import Icon from 'react-native-vector-icons/Feather';
import api from '../../services/api';
import getValidationErrors from '../../utils/getValidationErrors';
import Input from '../../components/Input';
import Button from '../../components/Button';
import {
  Container,
  Content,
  BackButton,
  Title,
  UserAvatarButton,
  UserAvatar,
} from './styles';
import { useAuth } from '../../hooks/auth';

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
}

const Profile: React.FC = () => {
  const navigation = useNavigation();
  const formRef = useRef<FormHandles>(null);
  const emailInputRef = useRef<TextInput>(null);
  const oldPasswordInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const confirmPasswordInputRef = useRef<TextInput>(null);
  const { user } = useAuth();

  const handleSignUp = useCallback(
    async (data: SignUpFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required('Nome é obrigatório!'),
          email: Yup.string()
            .required('E-mail é obrigatório!')
            .email('Digite um e-mail válido!'),
          password: Yup.string().min(6, 'Senha deve ter no mínimo 6 dígitos!'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await api.post('/users', data);

        Alert.alert(
          'Cadastro realizado com sucesso!',
          'Você já pode fazer seu logon no GoBarber.',
        );

        navigation.goBack();
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          console.error(error);

          formRef.current?.setErrors(getValidationErrors(error));

          return;
        }

        Alert.alert(
          'Erro no cadastro!',
          'Ocorreu um erro ao fazer seu cadastro, tente novamente.',
        );

        console.error(error);
        console.log(`'/users', ${data}`);
      }
    },
    [navigation],
  );

  const navigateGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flex: 1 }}
        >
          <Container>
            <Content>
              <BackButton onPress={navigateGoBack}>
                <Icon name="chevron-left" size={24} color="#999591" />
              </BackButton>

              <UserAvatarButton onPress={() => {}}>
                <UserAvatar source={{ uri: user.avatar_url }} />
              </UserAvatarButton>

              <View>
                <Title>Meu perfil</Title>
              </View>

              <Form ref={formRef} onSubmit={handleSignUp}>
                <Input
                  autoCapitalize="words"
                  name="name"
                  icon="user"
                  placeholder="Nome"
                  returnKeyType="next"
                  onSubmitEditing={() => emailInputRef.current?.focus()}
                />

                <Input
                  ref={emailInputRef}
                  keyboardType="email-address"
                  autoCorrect={false}
                  autoCapitalize="none"
                  name="email"
                  icon="mail"
                  placeholder="E-mail"
                  returnKeyType="next"
                  onSubmitEditing={() => oldPasswordInputRef.current?.focus()}
                />

                <Input
                  ref={oldPasswordInputRef}
                  secureTextEntry
                  name="old_password"
                  icon="lock"
                  placeholder="Senha atual"
                  textContentType="newPassword"
                  returnKeyType="next"
                  containerStyle={{ marginTop: 16 }}
                  onSubmitEditing={() => passwordInputRef.current?.focus()}
                />

                <Input
                  ref={passwordInputRef}
                  secureTextEntry
                  name="password"
                  icon="lock"
                  placeholder="Nova senha"
                  textContentType="newPassword"
                  returnKeyType="next"
                  onSubmitEditing={() =>
                    confirmPasswordInputRef.current?.focus()
                  }
                />

                <Input
                  ref={confirmPasswordInputRef}
                  secureTextEntry
                  name="password_confirmation"
                  icon="lock"
                  placeholder="Confirmar senha"
                  textContentType="newPassword"
                  returnKeyType="send"
                  onSubmitEditing={() => formRef.current?.submitForm()}
                />

                <Button onPress={() => formRef.current?.submitForm()}>
                  Confirmar mudanças
                </Button>
              </Form>
            </Content>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

export default Profile;
