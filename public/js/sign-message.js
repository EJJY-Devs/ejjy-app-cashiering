/*
 * JavaScript client-side example using jsrsasign
 */

// #########################################################
// #             WARNING   WARNING   WARNING               #
// #########################################################
// #                                                       #
// # This file is intended for demonstration purposes      #
// # only.                                                 #
// #                                                       #
// # It is the SOLE responsibility of YOU, the programmer  #
// # to prevent against unauthorized access to any signing #
// # functions.                                            #
// #                                                       #
// # Organizations that do not protect against un-         #
// # authorized signing will be black-listed to prevent    #
// # software piracy.                                      #
// #                                                       #
// # -QZ Industries, LLC                                   #
// #                                                       #
// #########################################################

/**
 * Depends:
 *     - jsrsasign-latest-all-min.js
 *     - qz-tray.js
 *
 * Steps:
 *
 *     1. Include jsrsasign 8.0.4 into your web page
 *        <script src="https://cdn.rawgit.com/kjur/jsrsasign/c057d3447b194fa0a3fdcea110579454898e093d/jsrsasign-all-min.js"></script>
 *
 *     2. Update the privateKey below with contents from private-key.pem
 *
 *     3. Include this script into your web page
 *        <script src="path/to/sign-message.js"></script>
 *
 *     4. Remove or comment out any other references to "setSignaturePromise"
 */
var privateKey = "-----BEGIN PRIVATE KEY-----\n" + 
"MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDHXB4SiY+0iLgR\n" + 
"MFapxKPOiVRBW2w7PWanwr3W1VIiZmyVcbu3SamVVqtzik3DujWEPiGafutqDcmE\n" + 
"s4muSRnThZBTMqlGuRSe5V/bqHGOqgqNI/eBSTbaPfG5gxEN8E31C/Luqz1epH0l\n" + 
"PsoJx7duDFmlR2g58rY3qxxmMKQ2wfXOozWyj9oMSQAXYd7YGkyD3GitZuYMDRB7\n" + 
"YcXd+yUJtPLMBr2qrvLdHD/IOFpDsXSX/sPiEFGD/dYauO/BRybs4toLyEBw/xX9\n" + 
"jWKzb4zxPFBnkExlH3kJLDerIY374zDaW84oET9wqZOzrjGgyfrATroQawkmTEY5\n" + 
"pnLcCr6PAgMBAAECggEAMZ+LWL/nBmAVuSmYGM/6mjlywIX6LdC90bpWuLgGpstp\n" + 
"8dUKjbgHP0YAjVT6wGKEWbOBd8xp2s8tvxtVhQ1rIUyYvSzaF+GP8XFU5/9IrONE\n" + 
"lxdBz2ui/LX4il3Gi/qp3PopcSEsuHcnM3MqpT6SORFX6x0YI3x3wOmVuxYWeg5i\n" + 
"gbJe5ApfiGT9vjQx1voL+lSqB/7zZyXNFWZV38Xj29poTvE8nUOdN0qkMtryQ++I\n" + 
"erDzpZmPKSldlArrk01/Uxd7WtufgTn0pObFFI91/G8H08LmaSFbpTVV0lV1PaRt\n" + 
"1w+bSfHSdXVlh37dLFw6iZU4CZtf3OsKzmW4qlVX2QKBgQD7GbUkEwbKlcy1QFm/\n" + 
"nFK/n0FFxRORS/b2HwcRl03Sz9UUJOIKEW5coy4lnDQ6AZJm8lJEMnqvgbe2adxT\n" + 
"Kr817EEMOm8YlkCYWLCG+ifxBDVRHB9b9nXGoFnLQqNkUIxtbYtJat/ayKjYh9c0\n" + 
"5nw5DKPtdhlrwt4UwBKz0vKWvQKBgQDLP/TKuz6+udjtDjWVfknJjmTtUjzmRSDh\n" + 
"ZFnmSbmlXyQlwJ7IzscNepprYB1XwCetjiy0kAnP2j+dgs+Hmlvloak4QhJLyzds\n" + 
"UjeEXw1ZG1JJxub+tmIv+dtmPvr92lQ2qrNjBZVB1D5jnyVU90vP9DtmicmgpeBJ\n" + 
"JhUCL16VOwKBgBEF5iTi8VPsoesryKnX1DhPeKJdQP1ZtA1tfxIvOsRu+JgcBAMA\n" + 
"uYWoPmmoVFYWYzF9fhxHe8/IMIc6WAh/XmUudh55G60ECq8JXDZaYTjSuzabfHjE\n" + 
"lal4l33TL7aOS2bjxUyd5T0021WKqAlbEtLfS4G+vuxyUpH/j4UHaRDVAoGARBrC\n" + 
"I8xqUe5kScqhGd6fSvJzzzHnRiGTyvKdTRUXJ9qheiT5D8B54oJai/BA5M52fSlO\n" + 
"wZIiN4uiFV1nvMB0WpW45ij9iHgnshw6jhhrmJgXErGbZW4nqHvIkJI5+CXYYhkA\n" + 
"0wVj5hMAdNE26SmUNbJY1RsGfNYYOWqRT5If11ECgYEAkx/dZN9+lPqec/mvZ3pD\n" + 
"/E8jbhGG3G1cg0Er9uAziQFK7yjT3/a1ZqOqyFVaumy/h95nNe8heri2A8fLCF7P\n" + 
"34oBls+A5w3QFuiQEV6J3tWYXiV0+6dQ7oH7stJrwkVTJ9B27zPlb6SL8zOW4XWr\n" + 
"bGCgokcPTXoY67gAObx53Vs=\n" + 
"-----END PRIVATE KEY-----";

qz.security.setSignatureAlgorithm("SHA512"); // Since 2.1
qz.security.setSignaturePromise(function(toSign) {
    return function(resolve, reject) {
        try {
            var pk = KEYUTIL.getKey(privateKey);
            var sig = new KJUR.crypto.Signature({"alg": "SHA512withRSA"});  // Use "SHA1withRSA" for QZ Tray 2.0 and older
            sig.init(pk); 
            sig.updateString(toSign);
            var hex = sig.sign();
            console.log("DEBUG: \n\n" + stob64(hextorstr(hex)));
            resolve(stob64(hextorstr(hex)));
        } catch (err) {
            console.error(err);
            reject(err);
        }
    };
});
