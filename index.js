const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { CosmosClient } = require("@azure/cosmos");

const connectionString = process.env.CONNECTION_STRING;
const client = new CosmosClient(connectionString);

const database = client.database("wedding_guest");
const container = database.container("wedding_guest");
const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'wedding-checkin/build')));

// Handles any requests that don't match the ones above
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname+'/wedding-checkin/build/index.html'));
});

app.post('/api/checkin', async (req, res) => {
  const { id } = req.body; // Assuming id is passed in the request
  
});

app.get('/api/checkin/:id', async (req, res) => {
    const guestId = req.params.id;
    try {
    
        // Query to find the guest by id
        const { resources: guests } = await container.items
          .query({
            query: "SELECT * FROM c WHERE c.GuestID = @GuestID",
            parameters: [{ name: "@GuestID", value: guestId.toString() }]
          })
          .fetchAll();
    
        if (guests.length === 0) {
          res.status(404).send('Guest not found.');
          return;
        }
    
        const guest = guests[0];
        guest.isCheckedIn = true; // Mark as checked in
    
        // Replace the item with its updated form
        const { resource: updatedGuest } = await container.item(guest.id, guest.GuestID).replace(guest);
    
        res.redirect(`http://localhost:3000/guest-info/${guestId}`);
      } catch (error) {
        console.error("Error during check-in:", error);
        res.status(500).send({ message: "Failed to check in guest", error: error.message });
    }
  });

  app.get('/api/guests/:id', async (req, res) => {
    const guestId = req.params.id;
    try {
    
        // Query to find the guest by id
        const { resources: guests } = await container.items
          .query({
            query: "SELECT * FROM c WHERE c.GuestID = @GuestID",
            parameters: [{ name: "@GuestID", value: guestId.toString() }]
          })
          .fetchAll();
    
        if (guests.length === 0) {
          res.status(404).send('Guest not found.');
          return;
        }
    
        const guest = guests[0];
        res.json(guest)
      } catch (error) {
        console.error("Error during fetching guest info:", error);
        res.status(500).send({ message: "Failed to fetch guest info", error: error.message });
    }
  });

  app.get('/api/allguests', async (req, res) => {
    const guestId = req.params.id;
    try {
    
        // Query to find the guest by id
        const { resources: guests } = await container.items
          .query({
            query: "SELECT * FROM c ",
          })
          .fetchAll();
    
        if (guests.length === 0) {
          res.status(404).send('No guest found.');
          return;
        }
    
        res.json(guests)
      } catch (error) {
        console.error("Error during fetching guest info:", error);
        res.status(500).send({ message: "Failed to fetch guest info", error: error.message });
    }
  });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});