#!/usr/bin/env node
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
import fs from "fs";
import path from "path";
import { CompilerRegistry } from "./CompilerRegistry";
import { armaSqsFrontEnd } from "./frontends/arma_sqs";
import { Parser } from "./parsing/Parser";
import { js_es5 } from "./frontends/javascript_es5";
import { CodeDumper } from "./semantic/CodeDumper";
import { SemanticAnalyzer } from "./semantic/SemanticAnalyzer";

async function ProcessFile(filePath: string, outputFileExtension: string, registry: CompilerRegistry)
{
    const data = await fs.promises.readFile(filePath, "utf-8");

    const inputFrontEnd = registry.FindFrontEndFromFileExtension(path.extname(filePath).substring(1));
    if(inputFrontEnd === undefined)
        throw new Error("No parser frontend available for the given input");
    console.error("INPUT:", inputFrontEnd.id + " - " + inputFrontEnd.name);
    if(inputFrontEnd.parsingRuleSet === undefined)
        throw new Error("Parsing of " + inputFrontEnd.id + " is not supported.");

    const outputFrontEnd = registry.FindFrontEndFromFileExtension(outputFileExtension);
    if(outputFrontEnd === undefined)
        throw new Error("No compiler frontend available for the given output format");
    console.error("OUTPUT:", outputFrontEnd.id + " - " + outputFrontEnd.name);

    const parser = new Parser(inputFrontEnd.parsingRuleSet);
    const parseTree = parser.Parse(data);

    const analyzer = new SemanticAnalyzer(inputFrontEnd.externals);
    const ast = analyzer.Analyze(parseTree);

    const codeDumper = new CodeDumper(outputFrontEnd);
    const dumped = codeDumper.Dump(ast);

    process.stdout.write(dumped);
}

function RegisterCompilerFrontEnds(registry: CompilerRegistry)
{
    registry.Register(armaSqsFrontEnd);
    registry.Register(js_es5);
}

const inputFilePath = process.argv[2];
const outputFileExtension = process.argv[3];
const registry = new CompilerRegistry;

RegisterCompilerFrontEnds(registry);
ProcessFile(inputFilePath, outputFileExtension, registry);
