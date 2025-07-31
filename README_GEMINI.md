# Gemini API Setup

## Environment Variables

Create a `.env` file in your project root and add your Gemini API key:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

## Getting a Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the API key and paste it in your `.env` file

## Features Added

### Note Form Features:
- **Fix Grammar**: Corrects grammar in your note content
- **Correct Text**: Fixes typos and improves text clarity

### Note View Features:
- **Summarize**: Generates a summary of the note content

## Usage

1. **Creating/Editing Notes**: Use the "Fix Grammar" and "Correct Text" buttons in the note form
2. **Viewing Notes**: Click "View" on any note and use the "Summarize" button to get a summary

## Error Handling

If you get API errors:
1. Check that your API key is correctly set in the `.env` file
2. Ensure the API key is valid and has proper permissions
3. Check the browser console for detailed error messages 