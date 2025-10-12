# Places Management

This feature provides comprehensive management of places in the Junglexp system, including listing, creating, updating, and deleting places with location coordinates.

## Features

- **Places Listing**: View all places in a paginated data table with search and filtering
- **Create Place**: Add new places with name, description, slug, and location coordinates
- **Update Place**: Edit existing place information and coordinates
- **View Place**: Display place details in a read-only format
- **Delete Place**: Remove places from the system with confirmation
- **Location Management**: Store and manage geographic coordinates using PostGIS

## Components

### Core Components

- `PlacesListing`: Main listing component with search and pagination
- `PlacesTable`: Data table component for displaying places
- `PlaceForm`: Form component for creating and updating places
- `PlaceViewPage`: Read-only view component for place details

### Table Components

- `columns.tsx`: Column definitions for the places data table
- `cell-action.tsx`: Action menu for each place row (edit, view, delete)

## Pages

- `/places` - Main places listing page
- `/places/new` - Create new place page
- `/places/[id]` - Edit place page
- `/places/[id]/view` - View place details page

## Data Structure

Each place contains:

- `id`: Unique identifier
- `name`: Display name
- `description`: Detailed description
- `slug`: URL-friendly identifier
- `location`: PostGIS geometry for coordinates

## Location Coordinates

Places use PostGIS geometry to store location coordinates:

- Latitude and longitude are stored as a POINT geometry
- Supports spatial queries and distance calculations
- Enables nearby place searches and geographic features

## Actions

The following server actions are available:

- `getPlaces()`: Fetch places with pagination and search
- `getPlaceById()`: Get place by ID
- `createPlace()`: Create new place
- `updatePlace()`: Update existing place
- `deletePlace()`: Delete place
- `getNearbyPlaces()`: Find places within a radius
- `getPlacesWithinRadius()`: Get places within specific radius

## Navigation

Places are accessible from the main navigation menu under "Nation Parks" section with a Landmark icon.

## Future Enhancements

- Map visualization for place locations
- Image management for places
- Advanced spatial queries
- Place categories and tags
- Integration with tours and activities
