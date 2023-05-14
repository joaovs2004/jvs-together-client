<script>
    import { connectedClients } from "../stores";
</script>

{#if $connectedClients}
    <div id="usersContainer">
        {#each $connectedClients as client}
            <div>
                <img src="https://avatars.dicebear.com/api/initials/{client}.svg" alt="avatar">
                <p title={client}>{client}</p>
            </div>
        {/each}
    </div>
{/if}

<style>
    img {
        width: 50px;
        margin: 10px;
        margin-bottom: 0px;
        border-radius: 100%;
    }

    p {
        margin-top: 0px;
        width: 100px;
        color: #fff;
        overflow:hidden;
        white-space:nowrap;
        text-overflow: ellipsis;
    }

    #usersContainer {
        display: flex;
        flex-wrap: wrap;
        margin: 15px;
        justify-content: center;
        justify-items: center;
        text-align: center;
    }
</style>