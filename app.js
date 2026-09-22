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
    const cookModeButton =
    document.getElementById(
        "cookModeButton"
    );

const cookModeView =
    document.getElementById(
        "cookModeView"
    );

const exitCookMode =
    document.getElementById(
        "exitCookMode"
    );

const cookRecipeTitle =
    document.getElementById(
        "cookRecipeTitle"
    );

const cookIngredients =
    document.getElementById(
        "cookIngredients"
    );

const cookSteps =
    document.getElementById(
        "cookSteps"
    );

const ingredientsTab =
    document.getElementById(
        "ingredientsTab"
    );

const stepsTab =
    document.getElementById(
        "stepsTab"
    );

const stepCounter =
    document.getElementById(
        "stepCounter"
    );

const stepText =
    document.getElementById(
        "stepText"
    );

const previousStep =
    document.getElementById(
        "previousStep"
    );

const nextStep =
    document.getElementById(
        "nextStep"
    );

const clearChecks =
    document.getElementById(
        "clearChecks"
    );
let recipes = [];
let currentRecipe = null;
let currentStep = 0;
let checkedIngredients =
    new Set();
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
currentRecipe =
    recipe;

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
cookModeButton.addEventListener(
    "click",
    () => {

        if (
            !currentRecipe
        ) {
            return;
        }

        openCookMode(
            currentRecipe
        );
    }
);

exitCookMode.addEventListener(
    "click",
    () => {

        cookModeView.style.display =
            "none";

        detailView.style.display =
            "block";
    }
);

function openCookMode(
    recipe
) {

    detailView.style.display =
        "none";

    cookModeView.style.display =
        "block";

    cookRecipeTitle.textContent =
        recipe.title;

    currentStep = 0;

    renderIngredients(
        recipe
    );

    renderStep(
        recipe
    );
}

function renderIngredients(
    recipe
) {

    cookIngredients.innerHTML =
        "";

    (recipe.ingredients || [])
        .filter(
            ingredient =>
                ingredient.type !==
                "section"
        )
        .forEach(
            ingredient => {

                const div =
                    document.createElement(
                        "div"
                    );

                div.className =
                    "ingredientCheck";

                div.textContent =
                    `${ingredient.amount || ""} ${ingredient.name || ""}`;

                div.addEventListener(
                    "click",
                    () => {

                        div.classList.toggle(
                            "checkedIngredient"
                        );
                    }
                );

                cookIngredients.appendChild(
                    div
                );
            }
        );
}

function renderStep(
    recipe
) {

    const steps =
        recipe.instructions || [];

    if (
        steps.length === 0
    ) {
        return;
    }

    const step =
        steps[currentStep].text;

    stepCounter.textContent =
        `Step ${currentStep + 1} of ${steps.length}`;

    stepText.textContent =
        step;

    const length =
        step.length;

    let fontSize =
        24;

if (length < 30) {

    fontSize = 56;

}
else if (length < 60) {

    fontSize = 44;

}
else if (length < 100) {

    fontSize = 36;

}
else if (length < 150) {

    fontSize = 30;

}
else {

    fontSize = 24;

}

stepText.style.fontSize =
    `${fontSize}px`;
}

stepsTab.addEventListener(
    "click",
    () => {

        cookIngredients.style.display =
            "none";

        clearChecks.style.display =
            "none";

        cookSteps.style.display =
            "block";

        stepsTab.classList.add(
            "tabActive"
        );

        ingredientsTab.classList.remove(
            "tabActive"
        );
    }
);

nextStep.addEventListener(
    "click",
    () => {

        const steps =
            currentRecipe.instructions || [];

        if (
            currentStep <
            steps.length - 1
        ) {

            currentStep++;

            renderStep(
                currentRecipe
            );
        }
    }
);

previousStep.addEventListener(
    "click",
    () => {

        if (
            currentStep > 0
        ) {

            currentStep--;

            renderStep(
                currentRecipe
            );
        }
    }
);

clearChecks.addEventListener(
    "click",
    () => {

        document
            .querySelectorAll(
                ".ingredientCheck"
            )
            .forEach(
                element =>
                    element.classList.remove(
                        "checkedIngredient"
                    )
            );
    }
);
ingredientsTab.addEventListener(
    "click",
    () => {

        cookIngredients.style.display =
            "block";

        clearChecks.style.display =
            "block";

        cookSteps.style.display =
            "none";

        ingredientsTab.classList.add(
            "tabActive"
        );

        stepsTab.classList.remove(
            "tabActive"
        );
    }
);
if (
    "serviceWorker"
    in navigator
) {

    window.addEventListener(
        "load",
        () => {

            navigator
                .serviceWorker
                .register(
                    "./service-worker.js"
                );
        }
    );
}
`