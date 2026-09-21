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
    const categoryFilter =
    document.getElementById(
        "categoryFilter"
    );

const tagFilter =
    document.getElementById(
        "tagFilter"
    );

const favoritesOnly =
    document.getElementById(
        "favoritesOnly"
    );

const clearFilters =
    document.getElementById(
        "clearFilters"
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
categoryFilter.addEventListener(
    "change",
    refreshFilters
);

tagFilter.addEventListener(
    "change",
    refreshFilters
);

favoritesOnly.addEventListener(
    "change",
    refreshFilters
);

clearFilters.addEventListener(
    "click",
    () => {

        searchBar.value = "";

        categoryFilter.value = "";

        tagFilter.value = "";

        favoritesOnly.checked =
            false;

        refreshFilters();
    }
);

function refreshFilters() {

    buildRecipeList(
        searchBar.value
    );
}
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

buildCategoryFilter();
buildTagFilter();
buildRecipeList();
}
function buildCategoryFilter() {

    categoryFilter.innerHTML =
        `
        <option value="">
            All Categories
        </option>
        `;

    const categories =
        [...new Set(
            recipes
                .map(
                    recipe =>
                        recipe.category
                )
                .filter(
                    category =>
                        category
                )
        )]
        .sort();

    categories.forEach(
        category => {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                category;

            option.textContent =
                category;

            categoryFilter.appendChild(
                option
            );
        }
    );
}

function buildTagFilter() {

    tagFilter.innerHTML =
        `
        <option value="">
            All Tags
        </option>
        `;

    const tags =
        [...new Set(
            recipes.flatMap(
                recipe =>
                    recipe.tags || []
            )
        )]
        .sort();

    tags.forEach(
        tag => {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                tag;

            option.textContent =
                tag;

            tagFilter.appendChild(
                option
            );
        }
    );
}

function buildRecipeList(
    searchText = ""
) {

    recipeList.innerHTML =
        "";

const filteredRecipes =
    recipes.filter(
        recipe => {

            const search =
                searchText
                    .toLowerCase();

            const categoryMatch =
                categoryFilter.value === ""
                ||
                recipe.category ===
                categoryFilter.value;

            const tagMatch =
                tagFilter.value === ""
                ||
                (recipe.tags || [])
                    .includes(
                        tagFilter.value
                    );

            const favoriteMatch =
                !favoritesOnly.checked
                ||
                recipe.isFavorite;

            if (
                !categoryMatch
                ||
                !tagMatch
                ||
                !favoriteMatch
            ) {
                return false;
            }

            if (
                search === ""
            ) {
                return true;
            }

            return (
                recipe.title
                    ?.toLowerCase()
                    .includes(
                        search
                    )
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
const tags =
    (recipe.tags || [])
        .join(", ");

button.innerHTML =
    `
    <div class="recipeTitle">
        ${recipe.title}
    </div>

    <div class="recipeMeta">
        ${recipe.category || ""}
    </div>

    <div class="recipeTags">
        ${tags}
    </div>
    `;
           button.addEventListener(
    "click",
    () => {

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