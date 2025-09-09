# AlertApp

AlertApp é um aplicativo móvel (Android, iOS e Web) construído com o framework Expo, que permite aos usuários criar e gerenciar alertas com diferentes níveis de urgência, prioridade e agendamento. Ele oferece um sistema de autenticação local e armazena os dados do usuário e dos alertas em um banco de dados SQLite diretamente no dispositivo.

## Estrutura do Projeto

O projeto segue a convenção de roteamento baseada em arquivos do `expo-router`, organizando as telas em diretórios que representam a estrutura de navegação do aplicativo.

*   `app/`: Contém todas as telas do aplicativo. A navegação é dividida em pilhas:
    *   `(auth)`: Para as telas de autenticação, como login e criação de conta. O usuário é redirecionado para esta pilha se não estiver autenticado.
    *   `(tabs)`: Para as telas principais do aplicativo, acessíveis via uma barra de navegação com abas.
*   `database/`: Armazena a lógica de persistência de dados. O arquivo `database.ts` gerencia a conexão com o banco de dados SQLite e as operações CRUD (Create, Read, Update, Delete) para alertas e usuários.
*   `context/`: Contém o gerenciamento de estado global, como o contexto de autenticação (`auth.tsx`).
*   `components/`: Agrupa os componentes reutilizáveis da interface de usuário.
*   `constants/`: Define variáveis de configuração e temas.

## Tecnologias Utilizadas

O projeto utiliza um conjunto robusto de bibliotecas para garantir um desenvolvimento rápido e eficiente:

*   **Expo**: Um framework poderoso para criar aplicações universais em React Native.
*   **Expo Router**: Gerencia o roteamento e a navegação da aplicação de forma declarativa e baseada em arquivos.
*   **Expo SQLite**: Permite o armazenamento de dados localmente no dispositivo de forma eficiente.
*   **React Native**: Para a construção da interface do usuário nativa.
*   **NativeWind**: Utiliza a sintaxe do Tailwind CSS para estilização, facilitando a criação de layouts responsivos.
*   **React Hook Form & Zod**: Gerencia formulários com validação de esquema de forma eficiente e tipada.
*   **date-fns**: Biblioteca leve e poderosa para manipulação e formatação de datas.

## Funcionalidades Atuais

*   **Autenticação e Registro**: Permite que usuários criem uma conta e façam login, com os dados persistidos no banco de dados local.
*   **Gerenciamento de Alertas**: Os usuários podem criar, editar e excluir alertas, definindo informações essenciais como título, descrição, tipo, prioridade e um agendamento opcional.
*   **Visualização de Alertas**:
    *   A tela inicial exibe de forma clara os alertas pendentes.
    *   A tela de histórico mostra todos os alertas criados e permite filtrá-los por tipo para uma melhor organização.
*   **Ações do Usuário**: É possível marcar alertas como concluídos ou excluí-los com um gesto intuitivo de deslizar na lista.
*   **Notificações Ativas**: O aplicativo verifica ativamente o banco de dados para alertas agendados e os marca como "atrasados" quando a data/hora agendada é ultrapassada, garantindo que o usuário esteja ciente de compromissos perdidos.

## Configuração do Projeto

Para configurar e executar o AlertApp localmente, siga os passos abaixo:

1.  **Instalar dependências:**
    ```bash
    npm install
    ```
2.  **Iniciar o aplicativo:**
    ```bash
    npx expo start
    ```