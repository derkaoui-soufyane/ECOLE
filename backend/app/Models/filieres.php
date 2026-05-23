<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class filieres extends Model
{
    use HasFactory;

    protected $table = 'filieres';
    protected $fillable = ['nom', 'code'];

    public function etudiants()
    {
        return $this->hasMany(Etudiant::class, 'id_filieres');
    }
    public function disponibilites()
    {
        return $this->hasMany(salle_diponible::class, 'id_filiere');
    }
    public function enseignements()
    {
        return $this->hasMany(Enseignement::class, 'id_filieres');
    }

    public function sujjets()
    {
        return $this->belongsToMany(Sujjet::class, 'sujjets_filieres', 'filiere_id', 'sujjets_id');
    }
    public function nvInscrires()
{
    return $this->hasMany(nv_inscrire::class, 'id_filiere');
}
public function classe()
{
    return $this->hasMany(Classe::class, 'id_filiere');
}
}