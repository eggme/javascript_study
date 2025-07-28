module.exports = function myCustomerWebpackLoader (content) {
    return content.replace("console.log(", "alert(");
}