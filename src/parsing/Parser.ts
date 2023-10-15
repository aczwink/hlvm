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

import { LexingRule, ParsingRuleSet, ProductionRule } from "../CompilerFrontEnd";
import { Dictionary } from "../Definitions";
import { ParseTree } from "./ParserTree";

function CreateJisonResultExpression(productionRule: ProductionRule)
{
    switch(productionRule.resultType)
    {
        case "array":
            return "[$" + productionRule.args[0] + "]";
        case "call":
            return "{ type: 'call', expr: $" + productionRule.args[0] + ", arg: $" + productionRule.args[1] + " }";
        case "identifier":
            return "{ type: 'identifier', id: $" + productionRule.args[0] + " }";
        case "passthrough":
            return "$" + productionRule.args[0];
        case "string":
            const arg = "$" + productionRule.args[0];
            return arg + ".substring(1, " + arg + ".length - 2)";
        default:
            throw new Error("Not implemented: " + productionRule.resultType);
    }
}

function LexingRuleToJisonRule(lexingRule: LexingRule)
{
    return [lexingRule.regex, lexingRule.symbol ? ("return '" + lexingRule.symbol + "';") : "/*skip*/"];
}

function BuildJisonGrammar(parsingRuleSet: ParsingRuleSet)
{
    const bnf: Dictionary<any> = {};
    for (const key in parsingRuleSet.parsingRules)
    {
        if (Object.prototype.hasOwnProperty.call(parsingRuleSet.parsingRules, key))
        {
            const ruleOrRules = parsingRuleSet.parsingRules[key]!;
            const rules = Array.isArray(ruleOrRules) ? ruleOrRules : [ruleOrRules];

            bnf[key] = rules.map(x => [x.rule, "$$ = " + CreateJisonResultExpression(x)])
        }
    }

    bnf["hlvm_startSymbol"] = [[parsingRuleSet.startSymbol + " EOF", "return $1"]];

    return {
        lex: {
            rules: [
                ...parsingRuleSet.lexingRules.map(LexingRuleToJisonRule),
                ["$", "return 'EOF'"]
            ]
        },

        bnf,
        start: "hlvm_startSymbol"
    };
}

export class Parser
{
    constructor(parsingRuleSet: ParsingRuleSet)
    {
        const jison = require("jison");
        const grammar = BuildJisonGrammar(parsingRuleSet);
        this.parserImpl = new jison.Parser(grammar);
    }

    //Public methods
    public Parse(input: string)
    {
        return this.parserImpl.parse(input) as ParseTree;
    }

    //Private state
    private parserImpl: any;
}