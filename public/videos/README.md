# Video Bestanden

Plaats hier je drone video's van de tuin.

## Vereiste Bestanden

1. **drone-overview-1.mp4** - Eerste drone video (gebruikt op homepage als achtergrond en op wandeling pagina)
2. **drone-overview-2.mp4** - Tweede drone video (gebruikt op wandeling pagina)

## Video Specificaties (Aanbevolen)

- **Formaat**: MP4 (H.264 codec)
- **Resolutie**: 1920x1080 (Full HD) of hoger
- **Aspect Ratio**: 16:9 (voor beste weergave)
- **Bestandsgrootte**: Optimaliseer video's voor web (gebruik handbrake of ffmpeg)
- **Duur**: Kortere video's laden sneller

## Optimalisatie Tips

Als je video's te groot zijn, kun je ze optimaliseren met:

```bash
# Met ffmpeg (als geïnstalleerd)
ffmpeg -i input.mp4 -c:v libx264 -crf 23 -preset medium -c:a aac -b:a 128k -movflags +faststart output.mp4
```

Of gebruik online tools zoals:
- HandBrake (desktop app)
- CloudConvert (online)
- Adobe Media Encoder

## Waar worden de video's gebruikt?

- **drone-overview-1.mp4**: 
  - Homepage hero sectie (autoplay, muted, loop als achtergrond)
  - Wandeling pagina (eerste video met controls)

- **drone-overview-2.mp4**:
  - Wandeling pagina (tweede video met controls)

## Opmerking

Als de video's niet beschikbaar zijn, zal de website automatisch terugvallen op de originele afbeelding op de homepage.



