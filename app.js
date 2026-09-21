const STORAGE_KEY =
    "recipeViewerLibrary";

const filePicker =
    document.getElementById(
        "filePicker"
    );

const searchBar =
    document.getElementById(
        "searchBar"
    );

const recipeCount =
    document.getElementById(
        "recipeCount"
    );

const recipeList =
    document.getElementById(
        "recipeList"
    );

let recipes = [];

loadSavedLibrary();

filePicker.addEventListener(
    "change",
    async event => {

        const file =
            event.target.files[0];

        if (!file) {
            return;
        }

        const text =
    await file.text();

alert(
    `File loaded: ${text.length} characters`
);

        localStorage.setItem(
            STORAGE_KEY,
            text
        );

        loadLibraryFromText(
            text
        );
    }
);

searchBar.addEventListener(
    "input",
    () => {

        buildRecipeList(
            searchBar.value
        );
    }
);

function loadSavedLibrary() {

    const savedLibrary =
        localStorage.getItem(
            STORAGE_KEY
        );

    if (!savedLibrary) {
        return;
    }

    loadLibraryFromText(
        savedLibrary
    );
}

function loadLibraryFromText(
    text
) {

    const backup =
        JSON.parse(
            text
        );
   alert(
    `Recipes found: ${
        backup.recipes?.length || 0
    }`
);

    recipes =
        backup.recipes || [];
alert(
    `Recipes array loaded`
);
    buildRecipeList();
}

function buildRecipeList(
    searchText = ""
) {

    recipeList.innerHTML =
        "";

    const filteredRecipes =
        recipes.filter(
            recipe => {

                if (
                    searchText === ""
                ) {
                    return true;
                }

                return recipe.title
                    ?.toLowerCase()
                    .includes(
                        searchText
                            .toLowerCase()
                    );
            }
        );

    recipeCount.textContent =
        `Recipes: ${filteredRecipes.length}`;

    filteredRecipes.forEach(
        recipe => {

            const button =
                document.createElement(
                    "button"
                );

            button.className =
                "recipeButton";

            button.innerHTML =
                `
                <div class="recipeTitle">
                    ${recipe.title}
                </div>

                <div class="recipeMeta">
                    ${recipe.category || ""}
                </div>
                `;

            recipeList.appendChild(
                button
            );
        }
    );
}