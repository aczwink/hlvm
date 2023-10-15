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

import { Dictionary } from "./Definitions";

export type ExternalType = "Print";
export interface ExternalDefinition
{
    name: string;
    type: ExternalType;
}

interface FormattingRuleSet
{
    FormatCall(calledExpression: string, argument: string): string;
    readonly statementTerminator: string;
}

export interface LexingRule
{
    regex: string;
    symbol?: string;
}

export interface ProductionRule
{
    args: number[];
    resultType: "array" | "call" | "identifier" | "passthrough" | "string";
    rule: string;
}

export interface ParsingRuleSet
{
    readonly lexingRules: LexingRule[];
    readonly parsingRules: Dictionary<ProductionRule | ProductionRule[]>;
    readonly startSymbol: string;
}

export interface CompilerFrontEnd
{
    readonly externals: ExternalDefinition[];
    readonly fileExtension: string;
    readonly formattingRuleSet: FormattingRuleSet;
    readonly id: string;
    readonly name: string;
    readonly parsingRuleSet?: ParsingRuleSet;
}