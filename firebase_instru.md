Execute os seguintes comandos no seu terminal, na pasta raiz do seu projeto (bubblechat ou meu-dashboard-firebase).

### 1. Comando para Iniciar a Configuração:

-- firebase init

### 2. Siga as Perguntas Interativas:

O terminal fará uma série de perguntas. Responda exatamente como a seguir:

"Are you ready to proceed? (Y/n)"

Digite Y e pressione Enter.
"Which Firebase features do you want to set up for this directory?"

Use as setas para navegar, a barra de espaço para selecionar e Enter para confirmar.
Selecione:
Firestore: Configure security rules and indexes files for Firestore.
Emulators: Set up local emulators for Firebase features.
Depois de marcar os dois, pressione Enter.
"Please select an option:"

Selecione Use an existing project.
"Select a default Firebase project for this directory:"

Selecione o seu projeto bubblechat-sativar (...) na lista.
"What file should be used for Firestore Rules?"

Apenas pressione Enter para aceitar o padrão (firestore.rules).
"What file should be used for Firestore indexes?"

Apenas pressione Enter para aceitar o padrão (firestore.indexes.json).
"Which Firebase emulators do you want to set up?"

Use a barra de espaço para selecionar:
Firestore Emulator
Pressione Enter.
"Which port do you want to use for the Firestore emulator?"

Apenas pressione Enter para aceitar o padrão (8080).
"Would you like to enable the Emulator UI?"

Digite Y e pressione Enter.
"Which port do you want to use for the Emulator UI?"

Apenas pressione Enter para aceitar o padrão (4000).
"Would you like to download the emulators now?"

Digite Y e pressione Enter.
O Firebase vai baixar os emuladores e criar os arquivos firebase.json e .firebaserc.

Com a inicialização concluída, você está pronto. Volte ao nosso plano original.

No primeiro terminal, rode o comando que falhou antes:

firebase emulators:start



Desta vez, ele deve iniciar com sucesso e mostrar o painel dos emuladores.

No segundo terminal, inicie seu aplicativo:

npm run dev -- --filter=admin-dashboard



Agora sim, ao acessar http://localhost:3001, você verá sua aplicação rodando localmente