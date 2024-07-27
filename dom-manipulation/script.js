document.addEventListener('DOMContentLoaded', () => {
    const quotes = [
      { text: 'The best way to predict the future is to invent it.', category: 'Inspiration' },
      { text: 'Life is what happens when you’re busy making other plans.', category: 'Life' },
      { text: 'You miss 100% of the shots you don’t take.', category: 'Motivation' }
    ];
  
    const quoteDisplay = document.getElementById('quoteDisplay');
    const newQuoteButton = document.getElementById('newQuote');
    const newQuoteText = document.getElementById('newQuoteText');
    const newQuoteCategory = document.getElementById('newQuoteCategory');
    const addQuoteButton = document.getElementById('addQuoteButton');
  
    function showRandomQuote() {
      const randomIndex = Math.floor(Math.random() * quotes.length);
      const quote = quotes[randomIndex];
      quoteDisplay.innerHTML = `<p>${quote.text}</p><p><em>${quote.category}</em></p>`;
    }
  
    function addQuote() {
      const text = newQuoteText.value.trim();
      const category = newQuoteCategory.value.trim();
  
      if (text && category) {
        quotes.push({ text, category });
        newQuoteText.value = '';
        newQuoteCategory.value = '';
        alert('New quote added successfully!');
      } else {
        alert('Please enter both quote text and category.');
      }
    }
  
    newQuoteButton.addEventListener('click', showRandomQuote);
    addQuoteButton.addEventListener('click', addQuote);
  
    showRandomQuote(); // Display a random quote initially
  });
  