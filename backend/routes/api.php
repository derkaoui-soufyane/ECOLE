<?php

use App\Http\Controllers\AdminController;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
Route::get('/usersIndex', [AdminController::class, 'usersIndex']);
Route::post('/usersStore', [AdminController::class, 'usersStore']);
Route::post('/usersShow', [AdminController::class, 'usersShow']);
Route::put('/usersUpdate', [AdminController::class, 'usersUpdate']);

// etudiant
Route::delete('/etudiantsDestroy', [AdminController::class, 'etudiantsDestroy']);
Route::post('/etudiantsStore', [AdminController::class, 'etudiantsStore']);
Route::get('/etudiants', [AdminController::class, 'etudiantsIndex']);
Route::put('/etudiantsUpdat/{id}', [AdminController::class, 'etudiantsUpdat']);

// ensegnements
Route::get('/enseignementsIndex', [AdminController::class, 'enseignementsIndex']);
Route::post('/enseignementsStore', [AdminController::class, 'enseignementsStore']);
Route::put('/enseignements/{id}', [AdminController::class, 'enseignementsUpdate']);
Route::delete('/enseignementsDestroy', [AdminController::class, 'enseignementsDestroy']);
// nv_inscrire
Route::get('/neuveauinscrire_show', [AdminController::class, 'neuveauinscrire_show']);
Route::post('/neuveauinscrire_store', [AdminController::class, 'neuveauinscrire_store']);
Route::post('/validation', [AdminController::class, 'validation']);
Route::delete('/delete_neuveauinscrire', [AdminController::class, 'delete_neuveauinscrire']);

// filiere
Route::get('/filieres', [AdminController::class, 'filieresIndex']);
Route::post('/filieresStore', [AdminController::class, 'filieresStore']);
Route::put('/filieresUpdate/{id}', [AdminController::class, 'filieresUpdate']);
Route::delete('/filieresDestroy', [AdminController::class, 'filieresDestroy']);


// notes
Route::get('/notesIndex', [AdminController::class, 'notesIndex']);
Route::post('/notesStore', [AdminController::class, 'notesStore']);
Route::put('/notesUpdate/{id}', [AdminController::class, 'notesUpdate']);
Route::delete('/notesDestroy/{id}', [AdminController::class, 'notesDestroy']);

// salle
Route::get('/sallesIndex', [AdminController::class, 'sallesIndex']);

// sujjetsIndex
Route::post('/sujjetsStore/{id}', [AdminController::class, 'sujjetsStore']);
Route::get('/sujjetsIndex', [AdminController::class, 'sujjetsIndex']);
Route::delete('/sujjetsDestroy/{id}', [AdminController::class, 'sujjetsDestroy']);
Route::put('/sujjetsUpdate/{id}', [AdminController::class, 'sujjetsUpdate']);



// sallesDisponiblesStore
Route::post('/sallesDisponiblesStore', [AdminController::class, 'sallesDisponiblesStore']);
Route::get('/sallesDisponiblesIndex', [AdminController::class, 'sallesDisponiblesIndex']);
Route::delete('/sallesDisponiblesDestroy/{id}', [AdminController::class, 'sallesDisponiblesDestroy']);
// classe
Route::get('/classeindex', [AdminController::class, 'classeindex']);
Route::post('/classeStore', [AdminController::class, 'classeStore']);
Route::put('/updateClasseEtud/{id}', [AdminController::class, 'updateClasseEtud']);
Route::put('/updateClasseEnse/{id}', [AdminController::class, 'updateClasseEnse']);
Route::put('/retireretudiantclacc/{id}', [AdminController::class, 'retireretudiantclacc']);
Route::put('/retirerEnsegnClacc/{id}', [AdminController::class, 'retirerEnsegnClacc']);
Route::delete('/classeDestroy/{id}', [AdminController::class, 'classeDestroy']);
// Email
Route::post('/contact', [AdminController::class, 'contact']);






