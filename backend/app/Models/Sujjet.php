<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sujjet extends Model
{
    use HasFactory;

    protected $table = 'sujjets';
    protected $fillable = ['matiere_nom'];

    public function filieres()
    {
        return $this->belongsToMany(filieres::class, 'sujjets_filieres', 'sujjets_id', 'filiere_id');
    }

    public function notes()
    {
        return $this->hasMany(notes::class, 'sujjet_id');
    }

    public function enseignements()
    {
        return $this->hasMany(Enseignement::class, 'id_jujjets');
    }
    public function disponibilites()
    {
        return $this->hasMany(salle_diponible::class, 'id_sujjets');
    }
}