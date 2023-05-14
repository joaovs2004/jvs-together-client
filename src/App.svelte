<script>
    import { Router, Route } from "svelte-navigator";
    import Error from "./routes/Error.svelte";
    import Main from "./routes/Main.svelte";
</script>

<Router>
    <Route path="/:roomId">
        <Main />
    </Route>
    <Route path="/">
        <Error />
    </Route>
</Router>