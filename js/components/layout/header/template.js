
export default function render(){
    return `
        <style>
            * {
                box-sizing: border-box;
            }
            header {
                width: 100%;
                border-bottom: 1px solid #ddd;
                background-color: var(--color-header);
                color: var(--color-dark-gray);
            }
            .container {
                max-width: 960px;
                margin: 0 auto;
                padding: 0 30px;
            }
            nav {
                min-height: 72px;
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
            ul {
                display: flex;
                list-style: none;
            }
            a {
                text-decoration: none;
                padding: 5px;
                color: inherit;
                text-transform: uppercase;
            }
        </style>
        <header>
            <div class="container">
                <nav>
                    <a href="/">Brick Art</a>
                    <ul>
                        <li><a href="/">Create</a></li>
                        <li><a href="/">Explore</a></li>
                        <li><a href="/">Shop</a></li>
                        <li><a href="/">Sign In</a></li>
                    </ul>
                </nav>
            </div>
        </header>`;
}