const fs = require('fs');
const deleteFile = filePath => {
  fs.unlink(filePath, err => {
    if (err) {
      if (err.code === 'ENOENT') {
        console.log('File not found, skipping:', filePath)
        return;
      }
      throw err;
    }
    console.log('Deleted File', filePath)
  })
}

module.exports = deleteFile;
