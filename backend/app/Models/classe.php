<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Classe extends Model
{
    use HasFactory;

    protected $table = 'classe';

    protected $fillable = [
        'nom_classe',
        'id_filiere',
    ];

  

    // Classe -> Etudiants (one to many)
    public function etudiants()
    {
        return $this->hasMany(Etudiant::class, 'id_classe');
    }

    // Classe -> Enseignements (one to many)
    public function enseignements()
    {
        return $this->hasMany(Enseignement::class, 'id_classe');
    }
    public function filiere()
    {
        return $this->belongsTo(filieres::class, 'id_filiere');
    }
    // Classe -> Salles disponibles (one to many)
    public function sallesDisponibles()
    {
        return $this->hasMany(salle_diponible::class, 'id_classe');
    }
}