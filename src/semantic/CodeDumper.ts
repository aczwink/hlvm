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
import { AST, Expression, Statement } from "./AST";

export class CodeDumper
{
    constructor(private outputFrontEnd: CompilerFrontEnd)
    {
    }

    //Public methods
    public Dump(ast: AST)
    {
        return ast.map(this.DumpStatement.bind(this)).join("\n");
    }

    //Private methods
    private DumpExpression(expr: Expression): string
    {
        switch(expr.type)
        {
            case "call":
                return this.outputFrontEnd.formattingRuleSet.FormatCall(this.DumpExpression(expr.expr), this.DumpExpression(expr.arg));
            case "external":
                return this.outputFrontEnd.externals.find(x => x.type === expr.externalType)!.name;
            case "literal":
                return '"' + expr.literal + '"';
        }
    }

    private DumpStatement(statement: Statement)
    {
        return this.DumpExpression(statement) + this.outputFrontEnd.formattingRuleSet.statementTerminator;
    }
}