<template>
    <q-page class="flex flex-center">
        <form @submit.prevent="addPost" style="width: 700px; max-width: 90vw;"> 
            <q-field
                name="titulo"
                id="titulo"
                icon="person"
                label="Titulo:">
                <q-input
                type="text"
                v-model="titulo"
                />
            </q-field><br>
            <q-field
                name="descricao"
                id="descricao"
                icon="description"
                label="Descrição:"
            >
            <q-input
                type="textarea"
                v-model="descricao"
            />
            </q-field><br>
                <q-field
                    icon="account_circle"
                    label="Foto de Capa"
                >
                <img :src="imageUrl" height="150"><br> 
                <q-btn push color="primary" label="Upload" @click="onPickFile"></q-btn>
                <input type="file" 
                    style="display: none" 
                    ref="fileInput" 
                    accept="image/*"
                    @change="onFilePicked"
                ></input>
                </q-field><br>  
                <!-- Caixa de post -->
                <input ref="fileUpload" class="hidden" type="file" @change="processFile" />
                <q-editor v-model="editor"
                       toolbar-bg="primary"
                       toolbar-text-color="white"
                       toolbar-toggle-color="yellow-8"
                       :toolbar="[
                       ['bold', 'italic', 'strike', 'underline', 'subscript', 'superscript'],
                       ['token', 'hr', 'link', 'custom_btn'],
                       ['print', 'fullscreen'],
                       ['save', 'upload'],
                       ['imageCustom'],
                       [
                         {
                           label: $q.i18n.editor.formatting,
                           icon: $q.icon.editor.formatting,
                           list: 'no-icons',
                           options: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'code']
                         },
                         {
                           label: $q.i18n.editor.fontSize,
                           icon: $q.icon.editor.fontSize,
                           fixedLabel: true,
                           fixedIcon: true,
                           list: 'no-icons',
                           options: ['size-1', 'size-2', 'size-3', 'size-4', 'size-5', 'size-6', 'size-7']
                         },
                         {
                           label: $q.i18n.editor.defaultFont,
                           icon: $q.icon.editor.font,
                           fixedIcon: true,
                           list: 'no-icons',
                           options: ['default_font', 'arial', 'arial_black', 'comic_sans', 'courier_new', 'impact', 'lucida_grande', 'times_new_roman', 'verdana']
                         },
                         'removeFormat'
                       ],
                       ['quote', 'unordered', 'ordered', 'outdent', 'indent'],
                       [
                         {
                           label: $q.i18n.editor.align,
                           icon: $q.icon.editor.align,
                           fixedLabel: true,
                           list: 'only-icons',
                           options: ['left', 'center', 'right', 'justify']
                         },
                         {
                           label: $q.i18n.editor.align,
                           icon: $q.icon.editor.align,
                           fixedLabel: true,
                           options: ['left', 'center', 'right', 'justify']
                         }
                       ],
                       ['undo', 'redo']
                     ]"
                     :definitions="{
                        bold: {cmd: 'bold', label: 'Bold', icon: null, tip: 'My bold tooltip'},
                        italic: {cmd: 'italic', icon: 'format_italic', tip: 'My italic tooltip'},
                        save: {tip: 'Savar rasculho', icon: 'save', label: 'Save', handler: saveWork},
                        imageCustom: {tip: 'Selecione uma imagem', icon: 'image', handler: upImg}
                    }"
                     :fonts="{
                       arial: 'Arial',
                       arial_black: 'Arial Black',
                       comic_sans: 'Comic Sans MS',
                       courier_new: 'Courier New',
                       impact: 'Impact',
                       lucida_grande: 'Lucida Grande',
                       times_new_roman: 'Times New Roman',
                       verdana: 'Verdana'
                     }" />

                        <div class="btnmodal z-top">
                                <q-btn
                                       class="btnSair"
                                       color="red"
                                       to="/index"
                                       push
                                       label="Cancelar"
                                />
                                <q-btn color="green" 
                                       type="submit" 
                                       push
                                       :disabled="loading" 
                                       :loading="loading" 
                                       class="justify-center btnSalvar"
                                       label="Enviar">
                                    <span slot="loader" class="custom-loader">
                                        <q-icon name="cached"/>
                                    </span>
                                </q-btn>
                        </div>
                    </form>
    </q-page>
</template>
      
<script>
    import * as firebase from 'firebase'

    export default {
        name: 'PageIndex',
        data () {
          return {
              editor: '',
              titulo: '',
              imageUrl: '',
              descricao: '',
              image: null,
          }
        },
        mounted() {
          this.$store.dispatch('carregarUsuario') 
          this.$store.dispatch('carregaPost') 
          this.$store.dispatch('carregaListaUsuario') 
        },
        methods: {
            addPost () {  
            if (!this.image) {
                return
            }
            var postData = {
                titulo: this.titulo,
                descricao: this.descricao,
                image: this.image, 
                editor: this.editor            
            }

        var newPostKey = firebase.database().ref().child('posts').push().key
        var updates = {}
        updates['/posts/' + newPostKey] = postData

        let imageUrl
        var key = newPostKey
        return firebase.database().ref().update(updates)
          .then((data) => {
            const key = newPostKey
            return key
          })
          .then(key => {
            const filename = this.image.name
            const ext = filename.slice(filename.lastIndexOf('.'))
            firebase.storage().ref('posts/' + key + ext).put(this.image)
            .then(function(snapshot) {
              console.log('Uploaded', snapshot.totalBytes, 'bytes.');
              snapshot.ref.getDownloadURL().then(function(url) {
                console.log('File available at', url)
                firebase.database().ref('posts').child(key).update({imageUrl: url, uidposts: newPostKey})  
              })
            })
            .catch(function(error) {
            // [START onfailure]
            console.error('Upload failed:', error);
            // [END onfailure]
          });
          })
          .catch((error) => {
            console.log(error)
          })
          this.$router.push('/index')
        },
        saveWork () {
        this.$q.notify({
        icon: 'done',
        color: 'positive',
        message: 'Rascunho salvo'
      })
    },
    upload () {
      this.$q.notify({
        icon: 'cloud_upload',
        color: 'secondary',
        message: 'Hmm, will upload at another time, ok?'
      })
    },
    upImg (x) {
      this.$q.notify('realizar upload da imagem')
      this.$refs.fileUpload.click()
    },
    processFile () {
      let component = this
      
      let file = this.$refs.fileUpload.files[0]
      var reader  = new FileReader();

      reader.addEventListener("load", function () {
        component.editor += `<img src="${reader.result}" />`
      }, false);

      if (file) {
        reader.readAsDataURL(file);
      }
    },
    onPickFile () {
            this.$refs.fileInput.click()
        },
        onFilePicked (event) {
            const files = event.target.files
            let filename = files[0].name
            if (filename.lastIndexOf('.') <= 0) {
                return alert('Adicione uma imagem válida!')
            }
            const fileReader = new FileReader()
            fileReader.addEventListener('load', () => {
                this.imageUrl = fileReader.result
            })
            fileReader.readAsDataURL(files[0])
            this.image = files[0]
        }
    },
    computed: {
        loading () {
            return this.$store.getters.loading
        },
        error () {
            return this.$store.getters.error
        },
     }
    }
</script>
