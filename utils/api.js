const axios = require('axios');

// exports.getOpenRequest = async() => {
//     axios
//         .get('http://localhost:3000/api/imports/getOpenImport')
//         .then((res) => console.log(res.data.data))
//         .catch((err) => console.log(err))
// }
exports.getImportRequest = async(category, status) => {
    try {
        const res = await axios.get('http://localhost:3000/api/imports/getImportRequest', { params: { category: category, status: status } });
        return res.data.rows;
    } catch (error) {
        console.log(error);
        return null;
    }
}

exports.updateOpenRequest = async(id, batch) => {
    axios
        .put(`http://localhost:3000/api/imports/updateImportStatus/:${id}`, batch)
        .then(res => res.data)
        .catch(err => console.log(err))
}
