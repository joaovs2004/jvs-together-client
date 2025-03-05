# Jvs Together Client

This is a project that allows users to watch YouTube videos simultaneously with others. This project is inspired by the Watch2Gether website. The front-end of the app is built with React and the websocket is built with Rust.

## Features

- **Real-time Video Sync:** Watch YouTube videos at the same time as other users.
- **Video Control:** Pause, play, skip, and adjust video speed with others in real time.
- **Multiple Users:** Enter in a room with your friends to watch videos together.
- **Multiple rooms**: Multiple rooms available. Each one is independent from the others, videos in one room do not affect the others.

## Project demonstration


https://github.com/user-attachments/assets/3e4b504f-d051-486f-bc68-a9f9f7d571b4



## How to test

The project is available to test in https://joaovs.v6.navy/<desired_room>

Replace <desired_room> with the room you want to enter

Example: https://joaovs.v6.navy/room1

Rooms are created automatically when you enter

## Tech Stack

- **Frontend:** React
- **Backend:** [WebSocket written in Rust](https://github.com/joaovs2004/jvs-together-websocket)

## How to run on your local machine

### Prerequisites

Before you begin, ensure you have the following:

- **Node.js**
- **npm**
- **Run the WebSocket server available at https://github.com/joaovs2004/jvs-together-websocket**

### Installing

1. Clone the repository:
   ```bash
   git clone https://github.com/joaovs2004/jvs-together-client
   cd jvs-together-client
    ```
2. Create .env with the url of WebSocket server
    ```bash
    # If you followed the steps of https://github.com/joaovs2004/jvs-together-client
    # The server will be at ws://localhost:9001
    echo 'VITE_WS_URL=ws://localhost:9001' > .env
    echo 'VITE_WS_URL=ws://localhost:9001' > .env.production
    ```
3. Run the project with:
    ```bash
    npm run dev
    ```

Now you can acess http://localhost:5173/<desired_room> and test the project
