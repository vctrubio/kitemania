# Makefile for importing sample data into Convex tables

import-all:
	npx convex import sampleBoards.jsonl --table boards --append
	npx convex import sampleKites.jsonl --table kites --append
	npx convex import sampleBars.jsonl --table bars --append
	npx convex import sampleStudents.jsonl --table students --append
	npx convex import sampleTeachers.jsonl --table teachers --append
	npx convex import samplePackages.jsonl --table packages --append
	
import-boards:
	npx convex import sampleBoards.jsonl --table boards --append

import-kites:
	npx convex import sampleKites.jsonl --table kites --append

import-bars:
	npx convex import sampleBars.jsonl --table bars --append

import-students:
	npx convex import sampleStudents.jsonl --table students --append

import-teachers:
	npx convex import sampleTeachers.jsonl --table teachers --append

import-equipment: import-boards import-kites import-bars

import-packages:
	npx convex import samplePackages.jsonl --table packages --append