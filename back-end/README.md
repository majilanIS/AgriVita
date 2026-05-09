# Agrivita Smart Agriculture Backend

Only one endpoint is exposed:

## POST /analyze

Accepts form data with:
- `type`: `"insect"` or `"disease"`
- `file`: image file upload (preferred)
- `image`: Base64 encoded image string or public image URL (optional)

Use either `file` or `image`, but not both.

### Example request (form-data)
- `type`: `insect`
- `file`: choose a local image file

### Example request (image string)
- `type`: `disease`
- `image`: `https://example.com/image.jpg`


### Example response
```json
{
  "type": "insect",
  "data": {
    "insect": "Insect name",
    "description": "Detailed description about the insect",
    "solution": "Actionable solution or recommendation"
  }
}
```

### Run
```bash
python main.py
```

### Notes
- The backend only serves `/analyze`
- No other public endpoints are used
- The `.env` file must include `INSECT_ID`, `CROP_HEALTH`, and `GROQ_API_KEY`
