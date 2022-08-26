(function () {
    const fname = <HTMLInputElement>document.getElementById('first_name');
    const lname = <HTMLInputElement>document.getElementById('last_name');
    const email = <HTMLInputElement>document.getElementById('email');
    const id = <HTMLInputElement>document.getElementById('id');
    const todo = <HTMLInputElement>document.getElementById('todo');
    const addForm = document.getElementById('add_form');
    const getForm = document.getElementById('get_form');
    const todoForm = document.getElementById('todo_form');
    const addSubmit = <HTMLButtonElement>document.getElementById('add_submit');
    const getSubmit = <HTMLButtonElement>document.getElementById('get_submit');
    const todoSubmit = <HTMLButtonElement>document.getElementById('todo_submit');
    const user = {
        name: <HTMLInputElement>document.getElementById('user-name'),
        email: <HTMLInputElement>document.getElementById('user-email'),
        todos: <HTMLUListElement>document.getElementById('user-todos'),
    };
    let currentUser: IUser|null = null;

    function populateUser(u: IUser) {
        let noUser = !u;

        if (noUser) {
            currentUser = null;
            hideTodo();
            u = {
                id: <number><any>'',
                first_name: '',
                last_name: '',
                email: ''
            };
        }

        id.value = `${u.id}`;
        user.name.textContent = `${u.first_name} ${u.last_name}`;
        user.email.textContent = u.email;

        const nodes = user.todos.childNodes;

        for (let i = nodes.length - 1; i >= 0; --i) {
            user.todos.removeChild(nodes[i]);
        }

        if (!!u.Todos) {
            for (const t of u.Todos) {
                const li = document.createElement('li');
                li.textContent = t.text;
                user.todos.appendChild(li);
            }
        }

        if (!noUser) {
            currentUser = u;
            showTodo();
        }
    }

    function buttonText(button: HTMLButtonElement, text: string) {
        if (!button) {
            return;
        }

        button.textContent = text;
    }

    function showTodo() {
        todoForm?.classList.remove('hidden');
    }

    function hideTodo() {
        todoForm?.classList.add('hidden');
    }

    addForm?.addEventListener('submit', async (ev) => {
        ev.preventDefault();

        try {
            buttonText(addSubmit, 'Submitting...');

            const uReq = await fetch(`/api/v1/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    first_name: fname.value,
                    last_name: lname.value,
                    email: email.value,
                }),
            });

            const addedUser = await uReq.json();

            if (!!addedUser.error) {
                throw new Error(addedUser.error);
            }

            populateUser(addedUser);
            buttonText(addSubmit, 'Submit');
        } catch (e) {
            populateUser(<any>null);
            buttonText(addSubmit, 'ERROR');
        }
    }, false);

    getForm?.addEventListener('submit', async (ev) => {
        ev.preventDefault();

        if (!id?.value) {
            return;
        }

        try {
            buttonText(getSubmit, 'Getting...');

            const uReq = await fetch(`/api/v1/users/${id.value}`);

            const gotUser = await uReq.json();

            if (!!gotUser.error) {
                throw new Error(gotUser.error);
            }

            populateUser(gotUser);
            buttonText(getSubmit, 'Get');
        } catch (e: any) {
            populateUser(<any>null);
            buttonText(getSubmit, e.message);
        }
    }, false);

    todoForm?.addEventListener('submit', async (ev) => {
        ev.preventDefault();

        if (!currentUser || !todo?.value) {
            return;
        }

        try {
            buttonText(todoSubmit, 'Submitting...');

            const r = await fetch(`/api/v1/todos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: currentUser.id,
                    text: todo.value,
                }),
            });

            const res = await r.json();

            if (!!res.error) {
                throw new Error(res.error);
            }

            buttonText(todoSubmit, 'Submit');
            todo.value = '';
        } catch (e) {
            populateUser(<any>null);
            buttonText(todoSubmit, 'ERROR');
        }
    }, false);
})();

interface IUser {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    Todos?: ITodo[];
}

interface ITodo {
    id: number;
    userid: number;
    text: string;
}