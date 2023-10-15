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

import { ExternalDefinition } from "../CompilerFrontEnd";
import { Expression as pt_Expression, ParseTree, Statement as pt_Statement } from "../parsing/ParserTree";
import { Expression, Statement } from "./AST";

export class SemanticAnalyzer
{
    constructor(private externals: ExternalDefinition[])
    {
    }

    //Public methods
    public Analyze(parseTree: ParseTree)
    {
        return parseTree.map(this.AnalyzeStatement.bind(this));
    }

    //Private methods
    private AnalyzeStatement(statement: pt_Statement): Statement
    {
        return this.AnalyzeExpression(statement);
    }

    //Private methods
    private AnalyzeExpression(expr: pt_Expression): Expression
    {
        if(typeof expr === "string")
        {
            return {
                type: "literal",
                literal: expr
            };
        }

        switch(expr.type)
        {
            case "call":
                return {
                    type: "call",
                    arg: this.AnalyzeExpression(expr.arg),
                    expr: this.AnalyzeExpression(expr.expr)
                };
            case "identifier":
                return this.AnalyzeIdentifier(expr.id);
        }
    }

    private AnalyzeIdentifier(identifier: string): Expression
    {
        const ext = this.externals.find(x => x.name === identifier);
        if(ext !== undefined)
        {
            return {
                type: "external",
                externalType: ext.type
            };
        }
        throw new Error("Method not implemented: " + identifier);
    }
}