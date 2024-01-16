import * as validationUtils from "../utils/validationUtils.js"

import "../config.js"
import * as trelloApiHelper from "../api/trelloApiHelper.js";

await validationUtils.validateTrello()

trelloApiHelper.getMemberBoards()
    .then(async boards => {
        /** @type {{[orgId: TrelloId]: TrelloBoard[]}} */
        const organizationId2Boards = boards.reduce((acc, board) => {
            if (! acc[board.idOrganization]) {
                acc[board.idOrganization] = []
            }
            acc[board.idOrganization].push(board)
            return acc
        }, {})

        const name2boards = await Promise.all(Object.entries(organizationId2Boards).map(async ([idOrg, boardList]) => {
            const orgName = await trelloApiHelper.getOrganizationName(idOrg)
            return [orgName, boardList]
        }))

        name2boards.forEach(([orgName, boardList]) => {
            console.log(`${orgName} :`)
            boardList.forEach(board => {
                console.log(`   - ${board.id} ${board.name}`)
            })
        })
    })
