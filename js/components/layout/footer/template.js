export default function render(){
    return `
        <style>
            * {
                box-sizing: border-box;
            }
            footer {
                width: 100%;
                background-color: var(--color-black);
                color: var(--color-white);
            }
            .container {
                max-width: 860px;
                margin: 0 auto;
                padding: 0 30px;
            }
            nav {
                min-height: 72px;
                display: flex;
                align-items: center;
            }
            a {
                text-decoration: none;
                color: inherit;
            }
        </style>
        <footer>
            <div class="container">
                <nav>
                    <a href="/">Logo</a>
                </nav>
            </div>
        </footer>`;
}