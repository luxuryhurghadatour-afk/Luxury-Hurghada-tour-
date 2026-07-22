# Random Joke Generator

A simple, elegant web application that fetches random jokes from an external API and stores them locally for easy access.

## Features

✨ **Random Joke Generation** - Fetches jokes from the Official Joke API  
💾 **Local Storage** - Automatically saves your 10 most recent jokes  
📋 **Copy to Clipboard** - Easily copy jokes to share with others  
🎯 **Joke History** - Click on previous jokes to view them again  
📱 **Responsive Design** - Works perfectly on desktop and mobile devices  
🎨 **Beautiful UI** - Modern gradient design with smooth animations  

## How to Use

1. Open `index.html` in your web browser
2. Click the **"Generate Joke"** button to fetch a random joke
3. Click **"Copy Joke"** to copy the current joke to your clipboard
4. View your recent jokes in the **"Recent Jokes"** section
5. Click any joke in history to view it again
6. Click **"Clear History"** to remove all saved jokes

## Technical Details

### Technologies
- **HTML5** - Structure
- **CSS3** - Styling with gradients and animations
- **Vanilla JavaScript** - No dependencies
- **Fetch API** - For API calls
- **LocalStorage API** - For persistent data storage

### API Used
- [Official Joke API](https://official-joke-api.appspot.com/random_joke)
  - Provides random jokes with setup and punchline format
  - No authentication required
  - Free to use

### File Structure
```
.
├── index.html       # HTML markup
├── styles.css       # CSS styling
├── script.js        # JavaScript logic
└── README.md        # This file
```

## Browser Compatibility

- Chrome/Edge 63+
- Firefox 55+
- Safari 11.1+
- Opera 50+

## LocalStorage Data

The app stores up to 10 jokes in your browser's localStorage under the key `jokeHistory`. This data persists across browser sessions.

**Storage Format:**
```json
["joke 1", "joke 2", ...]
```

## Error Handling

The app includes error handling for:
- Network failures
- API errors
- LocalStorage access issues
- Clipboard access denial

## Future Enhancements

- [ ] Category selection (programming, knock-knock, etc.)
- [ ] Dark mode toggle
- [ ] Export history as text/JSON
- [ ] Share joke on social media
- [ ] Joke ratings system
- [ ] Multiple API sources for variety

## License

Free to use and modify.
