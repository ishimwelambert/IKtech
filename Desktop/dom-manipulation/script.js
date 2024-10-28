document.addEventListener('DOMContentLoaded', () => {
    const quotes = JSON.parse(localStorage.getItem('quotes')) || [
        { text: "Keep it simple.", category: "Simplicity" },
        { text: "Stay positive.", category: "Positivity" },
        { text: "Be yourself.", category: "Self" }
    ];

    const quoteDisplay = document.getElementById('quoteDisplay');
    const newQuoteButton = document.getElementById('newQuote');
    const addQuoteButton = document.getElementById('addQuoteButton');
    const newQuoteText = document.getElementById('newQuoteText');
    const newQuoteCategory = document.getElementById('newQuoteCategory');
    const exportQuotesButton = document.getElementById('exportQuotes');
    const importFileInput = document.getElementById('importFile');
    const categoryFilter = document.getElementById('categoryFilter');

    function saveQuotes() {
        localStorage.setItem('quotes', JSON.stringify(quotes));
    }

    function showRandomQuote() {
        const filteredQuotes = getFilteredQuotes();
        if (filteredQuotes.length === 0) {
            quoteDisplay.innerText = "No quotes available.";
            return;
        }
        const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
        const randomQuote = filteredQuotes[randomIndex];
        quoteDisplay.innerText = `${randomQuote.text} - ${randomQuote.category}`;
    }

    function postQuoteToServer(quote) {
        // Implementation for posting quote to the server (if needed)
    }

    function addQuote() {
        const text = newQuoteText.value.trim();
        const category = newQuoteCategory.value.trim();
        if (text && category) {
            const newQuote = { text, category };
            quotes.push(newQuote);
            newQuoteText.value = '';
            newQuoteCategory.value = '';
            saveQuotes();
            postQuoteToServer(newQuote);
            alert('Quote added successfully!');
            populateCategories();
            showLatestQuote(newQuote); // Optional: Display the latest quote
        } else {
            alert('Please enter both quote text and category.');
        }
    }

    function createAddQuoteForm() {
        const formDiv = document.createElement('div');
        const textInput = document.createElement('input');
        const categoryInput = document.createElement('input');
        const addButton = document.createElement('button');

        textInput.id = 'newQuoteText';
        textInput.type = 'text';
        textInput.placeholder = 'Enter a new quote';

        categoryInput.id = 'newQuoteCategory';
        categoryInput.type = 'text';
        categoryInput.placeholder = 'Enter quote category';

        addButton.id = 'addQuoteButton';
        addButton.innerText = 'Add Quote';
        addButton.addEventListener('click', addQuote);

        formDiv.appendChild(textInput);
        formDiv.appendChild(categoryInput);
        formDiv.appendChild(addButton);
        document.body.appendChild(formDiv); // Append the form to the body or a specific container
    }

    function exportQuotesToJson() {
        const dataStr = JSON.stringify(quotes, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'quotes.json';
        a.click();
        URL.revokeObjectURL(url);
    }

    function importFromJsonFile(event) {
        const fileReader = new FileReader();
        fileReader.onload = function(event) {
            const importedQuotes = JSON.parse(event.target.result);
            quotes.push(...importedQuotes);
            saveQuotes();
            alert('Quotes imported successfully!');
            populateCategories();
        };
        fileReader.readAsText(event.target.files[0]);
    }

    function populateCategories() {
        const uniqueCategories = [...new Set(quotes.map(quote => quote.category))];
        categoryFilter.innerHTML = '<option value="all">All Categories</option>';
        uniqueCategories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        });
    }

    function getFilteredQuotes() {
        const selectedCategory = categoryFilter.value;
        if (selectedCategory === 'all') {
            return quotes;
        } else {
            return quotes.filter(quote => quote.category === selectedCategory);
        }
    }

    function filterQuotes() {
        showRandomQuote();
    }

    function loadLastSelectedCategory() {
        const lastSelectedCategory = localStorage.getItem('lastSelectedCategory');
        if (lastSelectedCategory) {
            categoryFilter.value = lastSelectedCategory;
        }
    }

    async function fetchQuotesFromServer() {
        // Implementation for fetching quotes from a server (if needed)
    }

    newQuoteButton.addEventListener('click', showRandomQuote);
    exportQuotesButton.addEventListener('click', exportQuotesToJson);
    importFileInput.addEventListener('change', importFromJsonFile);
    categoryFilter.addEventListener('change', filterQuotes);

    // Show a random quote initially
    showRandomQuote();
    // Load last selected category
    loadLastSelectedCategory();
    // Populate categories
    populateCategories();
    // Create the add quote form when the page loads
    createAddQuoteForm();
    // Fetch quotes from server periodically
    setInterval(fetchQuotesFromServer, 60000); // Fetch every 60 seconds
});
