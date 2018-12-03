<template>
        <q-page padding>
            <h4>Cadastro</h4>
            <form @submit.prevent="onSignup"> 
                <q-field
                    name="email"
                    id="email"
                    icon="mail"
                    label="Email"
                    :error="$v.email.$error"
                    error-label="Digite um e-mail válido"
                    count
                >
                <q-input
                    type="email"
                    v-model="email"
                    @blur="$v.email.$touch"
                />
                </q-field><br>
          
                <q-field
                    :count="16"
                    name="password"
                    label="Senha"
                    icon="lock"
                    id="password"
                >
                <q-input type="password" max-length="16" v-model="password" />
                </q-field><br>
          
                <q-btn color="positive" push type="submit" :disabled="loading" :loading="loading" class="justify-center">
                    Entrar
                    <span slot="loader" class="custom-loader">
                        <q-icon name="cached"/>
                    </span>
                </q-btn>
            </form>
        </q-page>
    </template>
    
    <script>
    import { required, email } from 'vuelidate/lib/validators'
            
    export default {
        data () {
            return {
                email: '',
                password: '',
            }
        },
            validations: {
                email: { required, email }
            },
            computed: {
                user () {
                    return this.$store.getters.user
                    },
                error () {
                    return this.$store.getters.error
                    },
                loading () {
                    return this.$store.getters.loading
                    }
                },
            watch: {
                user (value) {
                    if (value !== null && value !== undefined) {
                    this.$router.push('/profile')
                    }
                }
            }, 
            methods: {
                onSignup () {  
                    this.$store.dispatch('signUserUp', {email: this.email, password: this.password}) 
                },
                onDismissed () {
                    this.$store.dispatch('clearError')
                }
            }
        }
    </script>