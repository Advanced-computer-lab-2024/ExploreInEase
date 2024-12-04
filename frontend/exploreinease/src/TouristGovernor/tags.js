import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import ListSubheader from "@mui/material/ListSubheader";
import axios from "axios";
import GovernorNavbar from "./GovernorNavbar";
import Tooltip from "@mui/material/Tooltip";
import ListItemIcon from "@mui/material/ListItemIcon";
import IconButton from "@mui/material/IconButton";
import TagIcon from "@mui/icons-material/Tag";
import AddIcon from "@mui/icons-material/Add";
import CircularProgress from "@mui/material/CircularProgress"; // Import CircularProgress
import "./changePassword.css";

function Tags() {
  const location = useLocation();
  const { governorId } = location.state || {};
  const [tags, setTags] = React.useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [setOpen] = React.useState(false);
  // const [ setTagType] = React.useState(""); // State for tag type
  // const [ setName] = React.useState(""); // State for Name

  useEffect(() => {
    getAllTags();
  }, []);

  const getAllTags = async () => {
    setLoading(true); // Start loading
    try {
      const apiPath = `http://localhost:3030/getAllHistoricalTags/${governorId}`;
      const response = await axios.get(apiPath);
      console.log(response);

      if (Array.isArray(response.data.tags)) {
        const tags = response.data.tags.map((tag) => ({
          id: tag._id,
          tagType: tag.type,
          period: tag.period,
        }));
        setTags(tags);
      } else {
        console.error("Unexpected data format from API");
      }
    } catch (err) {
      console.error("Error fetching tags:", err);
    } finally {
      setLoading(false); // End loading
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  // const handleClose = () => {
  //   setOpen(false);
  //   setTagType("");
  //   setName("");
  // };

  // const handleSaveTag = async () => {
  //   if (tagType && period.trim()) {
  //     const body = {
  //       type: tagType,
  //       period: period,
  //     };
  //     const apiPath = `http://localhost:3030/createHistoricalTag/${governorId}`;

  //     try {
  //       const response = await axios.post(apiPath, body);
  //       getAllTags();
  //       setSuccessMessage(response.data.message || "Successfully!");
  //       setShowSuccessMessage(true);
  //       handleClose();
  //     } catch (error) {
  //       setErrorMessage("An error occurred");
  //       setShowErrorMessage(true);
  //       console.error("Error while saving the tag:", error);
  //     }
  //   }
  // };

  return (
    <div>
      <GovernorNavbar />

      <Box className="tags-background">
        {loading ? ( // Conditionally render spinner or content
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh", // Adjust as needed
            }}
          >
            <CircularProgress color="error"size={100} />
          </Box>
        ) : (
          <Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                bgcolor: "background.paper",
                borderRadius: "50px",
                padding: 2,
                boxShadow: 3,
                maxWidth: 400,
                margin: "0 auto",
              }}
            >
              <nav aria-label="main tags folders">
                <List
                  sx={{
                    width: "100%",
                    maxWidth: 360,
                    maxHeight: 700,
                    overflowY: "auto",
                    bgcolor: "background.paper",
                  }}
                  subheader={
                    <ListSubheader
                      sx={{
                        fontWeight: "bold",
                        fontSize: "1.25rem",
                        color: "red",
                        textAlign: "center",
                      }}
                    >
                      Tags
                    </ListSubheader>
                  }
                >
                  {tags.map((tag, index) => (
                    <React.Fragment key={index}>
                      <ListItem sx={{ display: "flex", alignItems: "center" }}>
                        <ListItemIcon>
                          <TagIcon sx={{ color: "primary.main" }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={`Type: ${tag.tagType}`}
                          secondary={`Period: ${tag.period}`}
                        />
                      </ListItem>
                      {index < tags.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>

                <Tooltip title="Create a Tag" arrow>
                  <IconButton
                    onClick={handleClickOpen}
                    sx={{
                      width: 50,
                      height: 35,
                      marginLeft: 35,
                      marginTop: 2,
                      bgcolor: "red",
                      color: "white",
                      "&:hover": {
                        bgcolor: "primary.dark",
                      },
                    }}
                  >
                    <AddIcon />
                  </IconButton>
                </Tooltip>
              </nav>
            </Box>
          </Box>
        )}
      </Box>
    </div>
  );
}

export default Tags;
