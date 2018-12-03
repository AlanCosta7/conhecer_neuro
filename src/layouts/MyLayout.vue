<template>
  <q-layout view="lHh Lpr lFf">
    <q-layout-header>
      <q-toolbar
        color="purple-9"
      >
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          aria-label="Menu"
        >
          <q-icon name="menu" />
        </q-btn>

        <q-toolbar-title>
          Conhecer Neuro
          <div slot="subtitle">Projeto de extensão UERJ v0.1</div>
          <img :src="image" class="imge" v-if="usuario">
        </q-toolbar-title>
      </q-toolbar>
    </q-layout-header>

    <q-layout-drawer
      v-model="leftDrawerOpen"
      :content-class="$q.theme === 'mat' ? 'bg-grey-2' : null"
    >
      <q-list
        no-border
        link
        inset-delimiter
      >
        <q-list-header>Menu</q-list-header>
        <q-item to="/" v-show="usuariologado == false">
          <q-item-side icon="face" />
          <q-item-main label="Login" />
        </q-item>
        <q-item to="/cadastro" v-show="usuariologado == false">
          <q-item-side icon="account_circle" />
          <q-item-main label="Cadastro" />
        </q-item>
        <q-item to="/index" v-show="usuariologado == true">
          <q-item-side icon="bookmark" />
          <q-item-main label="Introdução" />
        </q-item>
        <q-item v-show="usuariologado == true">
          <q-item-side icon="pregnant_woman"/>
          <q-item-main label="Hipóxia-Isquemia" />
        </q-item>
        <q-item v-show="usuariologado == true">
          <q-item-side icon="smoking_rooms" />
          <q-item-main label="Alcool e Nicotina" />
        </q-item>
        <q-item v-show="usuariologado == true">
          <q-item-side icon="local_pizza" />
          <q-item-main label="Malnutrição" />
        </q-item>
        <q-item @click.native="sair()" v-show="usuariologado == true">
          <q-item-side icon="exit_to_app" />
          <q-item-main label="Sair"/>
        </q-item>
      </q-list>
    </q-layout-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: 'MyLayout',
  data () {
    return {
      leftDrawerOpen: false
    }
  },
  methods: {
    sair() {
      this.$router.push('/')
      this.$store.dispatch('logout')
    },
  },
  computed: {
    usuario () {
      return this.$store.getters.usuario
    },
    user() {
      return this.$store.getters.user      
    },
    image () {
      return this.$store.getters.usuario.image
    },
    usuariologado () {
      return this.$store.getters.usuariologado
    },
    admin () {
      return this.$store.getters.admin
    }
  },
  watch: {
    usuario (value) {
          if (value !== null && value !== undefined) {
             this.$store.getters.usuario
          }
        }
  }
}
</script>
<style>
  .imge {
    position: absolute;
    right: 15px;
    background-color: white;
    border-color: white;
    border-radius: 100%;
    object-fit: cover;
    width: 30px;
    height: 30px;
  }
</style>
  