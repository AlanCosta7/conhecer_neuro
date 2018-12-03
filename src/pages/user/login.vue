<template>
    <q-page class="flex flex-center absolute-center">   
     <div>
        <div class="logodiv">
           <img src="../../assets/quasar-logo.png" alt="logo" class="logo" >
        </div> <br><br>
      <form @submit.prevent="onSignin">  
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
        </q-field>

        <q-field
        :count="16"
        name="password"
        label="Senha"
        icon="lock"
        id="password"
        >
        <q-input type="password" max-length="16" v-model="password" />
        </q-field><br>

        <q-btn color="positive" type="submit" push :disabled="loading" :loading="loading" class="btn">
            Entrar
            <span slot="loader" class="custom-loader">
                <q-icon name="cached"/>
            </span>
        </q-btn><br><br>
        <q-btn color="primary" @click='cadastrar()' push :disabled="loading" :loading="loading" class="btn">
                Cadastrar
                <span slot="loader" class="custom-loader">
                    <q-icon name="cached"/>
                </span>
        </q-btn>
      </form>
     </div>
    </q-page>
</template>
      
<script>
import { required, email } from 'vuelidate/lib/validators'

export default {
    data () {
        return {
        email: null,
        password: null
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
            this.$router.push('/index')
          }
        }
    }, 
    methods: {
        onSignin () {  
        this.$store.dispatch('signUserIn', {email: this.email, password: this.password})  
        },
        onDismissed () {
        this.$store.dispatch('clearError')
        },
        cadastrar () {
        this.$router.push('/cadastro')
        }
    }
}

</script>

<style>
    .btn {
        width: 100%;
    }
    .logo {
       width: 80px; 
    }
    .logodiv {
        text-align: center;
    }

</style>