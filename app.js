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
const listView =
    document.getElementById(
        "listView"
    );

const detailView =
    document.getElementById(
        "detailView"
    );

const backButton =
    document.getElementById(
        "backButton"
    );

const recipeDetail =
    document.getElementById(
        "recipeDetail"
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

        localStorage.setItem(
            STORAGE_KEY,
            text
        );

        loadLibraryFromText(
            text
        );
    }
);
backButton.addEventListener(
    "click",
    () => {

        detailView.style.display =
            "none";

        listView.style.display =
            "block";
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

    recipes =
        backup.recipes || [];

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

          button.addEventListener(
    "click",
    () => {

        alert(
            recipe.title
        );

        showRecipe(
            recipe
        );
    }
);

recipeList.appendChild(
    button
);
        }
    );
    
}
function showRecipe(
    recipe
) {

    listView.style.display =
        "none";

    detailView.style.display =
        "block";

    let html =
        `<h1>${recipe.title}</h1>`;

    if (
        recipe.category
    ) {

        html +=
            `<div><strong>Category:</strong> ${recipe.category}</div>`;
    }

    if (
        recipe.source
    ) {

        html +=
            `<div><strong>Source:</strong> ${recipe.source}</div>`;
    }

    if (
        recipe.servings
    ) {

        html +=
            `<div><strong>Yield:</strong> ${recipe.servings}</div>`;
    }

    if (
        recipe.duration
    ) {

        html +=
            `<div><strong>Duration:</strong> ${recipe.duration}</div>`;
    }

    if (
        recipe.tags?.length
    ) {

        html +=
            `<div><strong>Tags:</strong> ${recipe.tags.join(", ")}</div>`;
    }

    html +=
        `<h2>Ingredients</h2>`;

    (
        recipe.ingredients || []
    )
    .forEach(
        ingredient => {

            if (
                ingredient.type ===
                "section"
            ) {

                html +=
                    `<h3>${ingredient.name}</h3>`;

                return;
            }

            html +=
                `<div>${ingredient.amount || ""} ${ingredient.name || ""}</div>`;
        }
    );

    html +=
        `<h2>Instructions</h2>`;

    (
        recipe.instructions || []
    )
    .forEach(
        step => {

            html +=
                `<div>${step.stepNumber}. ${step.text}</div>`;
        }
    );

    recipeDetail.innerHTML =
        html;
}