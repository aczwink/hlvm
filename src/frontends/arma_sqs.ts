/**
 * hlvm
 * Copyright (C) 2023 Amir Czwink (amir130@hotmail.de)
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * 
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 * */

import { CompilerFrontEnd } from "../CompilerFrontEnd";

export const armaSqsFrontEnd: CompilerFrontEnd = {
    externals: [
        {
            name: "hint",
            type: "Print"
        }
    ],

    fileExtension: "sqs",

    formattingRuleSet: {
        FormatCall: (expr, arg) => expr + " " + arg,
        
        statementTerminator: ""
    },

    id: "arma_sqs",
    name: "ArmA Status Quo Script",

    parsingRuleSet: {
        lexingRules: [
            { regex: "\n",      symbol: "LINEBREAK" },
            { regex: "\\s+" },
            { regex: "[a-z]+",  symbol: "IDENTIFIER" },
            { regex: '".*"',    symbol: "STRING_LITERAL" },
        ],

        parsingRules: {
            command:            { rule: "IDENTIFIER", resultType: "identifier", args: [1] },
            command_statement:  { rule: "command value", resultType: "call", args: [1, 2] },
            value:              { rule: "STRING_LITERAL", resultType: "string", args: [1], },
            statement:          { rule: "command_statement LINEBREAK", resultType: "passthrough", args: [1] },
            statements:         [
                                    { rule: "statement", resultType: "array", args: [1] },
                                    { rule: "statement statements", resultType: "array", args: [1, 2] }
            ]
        },
        startSymbol: "statements"
    }
};