// Array to hold quotes
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
    { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
    { text: "Don't let yesterday take up too much of today.", category: "Inspiration" },
    { text: "You learn more from failure than from success.", category: "Learning" },
  ];
  
  const serverUrl = 'https://jsonplaceholder.typicode.com/posts';
  
  // Function to show a random quote
  function showRandomQuote() {
    const filteredQuotes = getFilteredQuotes();
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const quote = filteredQuotes[randomIndex];
    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.textContent = `${quote.text} - ${quote.category}`;
    sessionStorage.setItem('lastQuote', JSON.stringify(quote));
  }
  
  // Function to add a new quote
  function addQuote() {
    const newQuoteText = document.getElementById('newQuoteText').value;
    const newQuoteCategory = document.getElementById('newQuoteCategory').value;
    
    if (newQuoteText && newQuoteCategory) {
      const newQuote = { text: newQuoteText, category: newQuoteCategory };
      quotes.push(newQuote);
      saveQuotes();
      alert('Quote added successfully!');
      document.getElementById('newQuoteText').value = '';
      document.getElementById('newQuoteCategory').value = '';
      populateCategories();
      syncQuoteToServer(newQuote);
    } else {
      alert('Please enter both a quote and a category.');
    }
  }
  
  // Function to save quotes to local storage
  function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
  }
  
  // Function to create the form for adding new quotes
  function createAddQuoteForm() {
    const formContainer = document.getElementById('formContainer');
    const form = document.createElement('div');
    form.innerHTML = `
      <div>
        <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
        <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
        <button onclick="addQuote()">Add Quote</button>
      </div>
    `;
    formContainer.appendChild(form);
  }
  
  // Function to export quotes as JSON
  function exportQuotes() {
    const dataStr = JSON.stringify(quotes, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'quotes.json';
    link.click();
    URL.revokeObjectURL(url);
  }
  
  // Function to import quotes from JSON file
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
  
  // Function to filter quotes based on selected category
  function filterQuotes() {
    const selectedCategory = document.getElementById('categoryFilter').value;
    localStorage.setItem('selectedCategory', selectedCategory);
    displayQuotes();
  }
  
  // Function to get filtered quotes
  function getFilteredQuotes() {
    const selectedCategory = localStorage.getItem('selectedCategory') || 'all';
    if (selectedCategory === 'all') {
      return quotes;
    }
    return quotes.filter(quote => quote.category === selectedCategory);
  }
  
  // Function to display quotes based on selected category
  function displayQuotes() {
    const filteredQuotes = getFilteredQuotes();
    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.innerHTML = '';
    filteredQuotes.forEach(quote => {
      const quoteElement = document.createElement('div');
      quoteElement.textContent = `${quote.text} - ${quote.category}`;
      quoteDisplay.appendChild(quoteElement);
    });
  }
  
  // Function to populate categories in the dropdown
  function populateCategories() {
    const categoryFilter = document.getElementById('categoryFilter');
    const categories = ['all', ...new Set(quotes.map(quote => quote.category))];
    categoryFilter.innerHTML = categories.map(category => `<option value="${category}">${category}</option>`).join('');
    const selectedCategory = localStorage.getItem('selectedCategory');
    if (selectedCategory) {
      categoryFilter.value = selectedCategory;
    }
  }
  
  // Load last viewed quote from session storage
  function loadLastViewedQuote() {
    const lastQuote = JSON.parse(sessionStorage.getItem('lastQuote'));
    if (lastQuote) {
      const quoteDisplay = document.getElementById('quoteDisplay');
      quoteDisplay.textContent = `${lastQuote.text} - ${lastQuote.category}`;
    }
  }
  
  // Function to sync quote to server
  async function syncQuoteToServer(quote) {
    try {
      const response = await fetch(serverUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(quote),
      });
      if (!response.ok) {
        throw new Error('Failed to sync quote to server');
      }
    } catch (error) {
      console.error('Error syncing quote:', error);
    }
  }
  
  // Function to fetch quotes from server
  async function fetchQuotesFromServer() {
    try {
      const response = await fetch(serverUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch quotes from server');
      }
      const serverQuotes = await response.json();
      const newQuotes = serverQuotes.filter(serverQuote => !quotes.some(localQuote => localQuote.text === serverQuote.text));
      if (newQuotes.length > 0) {
        quotes.push(...newQuotes);
        saveQuotes();
        alert('New quotes fetched from server!');
        populateCategories();
        displayQuotes();
      }
    } catch (error) {
      console.error('Error fetching quotes:', error);
    }
  }
  
  // Function to sync quotes periodically
  function syncQuotes() {
    fetchQuotesFromServer();
  }
  
  // Periodically fetch quotes from the server
  setInterval(syncQuotes, 60000); // Fetch every 60 seconds
  
  // Event listener for the Show New Quote button
  document.getElementById('newQuote').addEventListener('click', showRandomQuote);
  document.getElementById('exportQuotes').addEventListener('click', exportQuotes);
  
  // Call the function to create the form and populate categories on page load
  createAddQuoteForm();
  populateCategories();
  loadLastViewedQuote();
  displayQuotes();
  