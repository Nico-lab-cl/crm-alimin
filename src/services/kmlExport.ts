import lotPolygons from './lotPolygons.json';
import { Lot } from '@/types';

/**
 * Generates a KML string from the polygon data
 * @param lots - Current lots from database for status/metadata
 * @returns KML string
 */
export function generateKML(lots: Lot[]): string {
    const kmlHeader = `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>Lomas del Mar - Loteo</name>
    <Style id="available">
      <PolyStyle><color>995f5936</color><outline>1</outline></PolyStyle>
    </Style>
    <Style id="sold">
      <PolyStyle><color>994444ef</color><outline>1</outline></PolyStyle>
    </Style>
    <Style id="reserved">
      <PolyStyle><color>990b9ef5</color><outline>1</outline></PolyStyle>
    </Style>
`;

    const kmlFooter = `
  </Document>
</kml>`;

    const placemarks = lotPolygons.map(poly => {
        const dbLot = lots.find(l => l.number === poly.number);
        const status = dbLot?.status || 'available';
        const coordinates = poly.paths.map(p => `${p[1]},${p[0]},0`).join(' ');

        return `
    <Placemark>
      <name>Lote ${poly.number}</name>
      <description>
        Estado: ${status}
        Etapa: ${dbLot?.stage || 'N/A'}
        Area: ${dbLot?.area || 'N/A'} m2
      </description>
      <styleUrl>#${status}</styleUrl>
      <Polygon>
        <outerBoundaryIs>
          <LinearRing>
            <coordinates>${coordinates}</coordinates>
          </LinearRing>
        </outerBoundaryIs>
      </Polygon>
    </Placemark>`;
    }).join('');

    return kmlHeader + placemarks + kmlFooter;
}

/**
 * Triggers a download of the KML file
 */
export function downloadKML(kmlContent: string, fileName: string = 'lomas-del-mar.kml') {
    const blob = new Blob([kmlContent], { type: 'application/vnd.google-earth.kml+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
